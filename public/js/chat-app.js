const socket = io();
const ROOM = "my_room"
socket.emit('subscribe', ROOM);

function get(selector, root = document) {
    return root.querySelector(selector);
}

document.addEventListener('DOMContentLoaded', () => {
    $(window).resize(function () { // change CSS property (on-resize) without requiring click
        var coll = document.getElementsByClassName("chat-collapsible");
        for (var i = 0; i < coll.length; i++) {
            coll[i].classList.toggle("chat-active");
            var content = coll[i].nextElementSibling;

            // console.log(content.style.display);

            var mediaQuery = window.matchMedia("(min-width: 600px)");
            if (mediaQuery.matches) { // tablet
                content.style.display = "flex";
            } else { // phone
                content.style.display = "block";
            }
        }
    })

    var coll = document.getElementsByClassName("chat-collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("chat-active");
            var content = this.nextElementSibling;

            // console.log(content.style.display);

            var mediaQuery = window.matchMedia("(min-width: 600px)");
            if (mediaQuery.matches) { // tablet
                if (content.style.display === "flex"
                    || content.style.display == "") { // work on first click
                    content.style.display = "none";
                } else {
                    content.style.display = "flex";
                }
            } else { // phone
                if (content.style.display === "block"
                    || content.style.display == "") { // work on first click
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            }
        });
    }

    ////

    loadMessages()
    loadMessagesFromClickedUser()
    handleSendMessages()
})

function handleSendMessages() {
    const msgForm = get(".msger-inputarea");
    msgForm.addEventListener("submit", async e => {
        e.preventDefault();

        const msgInput = get(".msger-input");
        const msg = msgInput.value;
        if (!msg) return;

        const createdMessage = await createMessage(msg);
        insertMessageToDB(createdMessage.authenticated_user_id, createdMessage.receiver_id, createdMessage.msg, createdMessage.utc_timestamp);
        socket.emit("send_private_message", { createdMessage, room: ROOM, socketId: socket.id });// socket.id is refreshed after reload page on the client
    });
}
async function createMessage(msg) {
    let authenticated_user = await getAuthenticatedUser()
    // .then(authenticatedUser => authenticatedUser).catch(error => console.log(error)); // doesn't work
    let authenticated_user_id = authenticated_user._id
    let authenticated_user_username = authenticated_user.username
    let sender_id = authenticated_user_id
    let receiver_id = $('#id_selected_user').attr("data-id_selected_user")
    let receiver_user = await getUserById(receiver_id)
    let now = new Date()
    let profile_img = `/uploads/profile-pictures/${authenticated_user.profile_image_upload}`
    let utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())
    // console.log(typeof utc_timestamp) // number

    return {
        authenticated_user,
        authenticated_user_id,
        authenticated_user_username,
        sender_id,
        receiver_id,
        receiver_user,
        profile_img,
        utc_timestamp,
        msg
    }
}
socket.on('render_private_message', async (data) => {
    // console.log({ data });
    let authenticated_user = await getAuthenticatedUser()// re-authenticate, could be the other user at this call
    let authenticated_user_id = authenticated_user._id

    // UPDATE CONTACT LIST - latest message and timestamp of contact
    if (authenticated_user_id == data.authenticated_user_id) { // update contact list of the sender
        $(".contact").find(`[data-id_user='${data.receiver_id}']`).find(".last_message").html(data.msg)
        $(".contact").find(`[data-id_user='${data.receiver_id}']`).find(".last_message").closest(".contact-info").find(".timestamp").html(new Date(data.utc_timestamp).toLocaleString("en-US", { timeZone: "America/Vancouver", dateStyle: "short", timeStyle: "short" }))
    }
    if ($(".contact").find(`[data-id_user='${data.receiver_id}']`).length == 0) { // update contact list of the receiver
        $(".contact").find(`[data-id_user='${data.sender_id}']`).find(".last_message").html(data.msg)
        $(".contact").find(`[data-id_user='${data.sender_id}']`).find(".last_message").closest(".contact-info").find(".timestamp").html(new Date(data.utc_timestamp).toLocaleString("en-US", { timeZone: "America/Vancouver", dateStyle: "short", timeStyle: "short" }))
    }

    // UPDATE CHATBOX
    var recipient_id = $("#id_selected_user").attr('data-id_selected_user');
    if (recipient_id!= data.receiver_id && recipient_id!=data.sender_id) {
        return; // a client switched to another contact chat, so don't append any messages to chatbox
    } else {
        if (data.receiver_id == authenticated_user_id) { // if i'm receiver of the message
            appendMessageToDOM(data.authenticated_user_username, data.profile_img, "left", data.msg, data.utc_timestamp);
        } else if (data.sender_id == authenticated_user_id) { // if i'm sender of the message
            appendMessageToDOM(data.authenticated_user_username, data.profile_img, "right", data.msg, data.utc_timestamp);
        }
        const msgInput = get(".msger-input");
        msgInput.value = ""; // clean input
    }
});

function getAuthenticatedUser() {
    var authToken = ("; " + document.cookie).split("; _authToken=").pop().split(";").shift();
    // let result = null
    return Promise.resolve($.ajax({
        type: "GET",
        headers: {
            "Authorization": "Bearer " + authToken
        },
        url: `/api/user/get-user-from-token-ajax`,
        dataType: 'json',
        // async: false, // deprecated
        success: function (currentUser) {
            // console.log({ currentUser })
            // result = currentUser
            return currentUser
        },
        error: function (data) {
            // console.log({data});
            return data
        }
    }))
    // return result
}
function getUserById(user_id) {
    var authToken = ("; " + document.cookie).split("; _authToken=").pop().split(";").shift();
    return Promise.resolve($.ajax({
        type: "GET",
        headers: {
            "Authorization": "Bearer " + authToken
        },
        url: `/api/user/get-user-by-id-ajax/${user_id}`,
        dataType: 'json',
        success: function (user) {
            // console.log({ user })
            return user
        },
        error: function (err) {
            // console.log({err});
        }
    }))
}

function insertMessageToDB(sender_id, receiver_id, message, sent_at) {
    $.ajax({
        type: "POST",
        data: {
            sender_id,
            receiver_id,
            message,
            sent_at
        },
        url: `/api/messages/send-message/${receiver_id}`,
        dataType: 'json',
        success: function (data) {
            // console.log(data)
        },
        error: function (data) {
            // console.log(data);
        }
    })
}
function appendMessageToDOM(name, img, side, text, utc_timestamp) {
    const msgHTML = `
        <div class="msg ${side}-msg">
            <img class="msg-img" src="${img}"></img>
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${new Date(utc_timestamp).toLocaleString("en-US", { timeZone: "America/Vancouver", dateStyle: "short", timeStyle: "short" })}</div>
                </div>
                <div class="msg-text">${text}</div>
            </div>
        </div>
    `;
    const msgerChat = get(".msger-chat");
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function loadMessages() {
    let style = $(".right-sidebar").attr("style");
    if (style.includes('hidden')) { // don't load messages when no user is selected (url)
        return;
    }

    var authToken = ("; " + document.cookie).split("; _authToken=").pop().split(";").shift();
    $.ajax({
        type: "GET",
        headers: {
            "Authorization": "Bearer " + authToken
        },
        url: `/api/user/get-user-from-token-ajax`,
        dataType: 'json',
        success: function (currentUser) {
            // console.log({ currentUser })
            var recipient_id = $("#id_selected_user").attr('data-id_selected_user');

            $.ajax({
                type: "GET",
                headers: {
                    "Authorization": "Bearer " + authToken
                },
                url: `/api/user/get-user-by-id-ajax/${recipient_id}`,
                dataType: 'json',
                success: function (recipient) {
                    // console.log({ recipient })

                    $.ajax({
                        type: "GET",
                        headers: {
                            "Authorization": "Bearer " + authToken
                        },
                        url: `/api/messages/get-contact-messages/${recipient_id}`,
                        dataType: 'json',
                        success: function (messages) {
                            // console.log({ messages })
                            for (let i = 0; i < messages.length; i++) {
                                if (messages[i].receiver_id == currentUser._id) {
                                    appendMessageToDOM(recipient.username, `/uploads/profile-pictures/${recipient.profile_image_upload}`, "left", messages[i].message, messages[i].sent_at);
                                } else if (messages[i].sender_id == currentUser._id) {
                                    appendMessageToDOM(currentUser.username, `/uploads/profile-pictures/${currentUser.profile_image_upload}`, "right", messages[i].message, messages[i].sent_at);
                                }
                                // if (messages[i].receiver_id == currentUser._id) {
                                //     appendMessageToDOM(currentUser.username, `/uploads/profile-pictures/${currentUser.profile_image_upload}`, "right", messages[i].message, messages[i].sent_at);
                                // } else {
                                //     appendMessageToDOM(recipient.username, `/uploads/profile-pictures/${recipient.profile_image_upload}`, "left", messages[i].message, messages[i].sent_at);
                                // }
                            }
                            // socket.emit('joinRoom', { room: "auto_gen_pls" });
                        },
                        error: function (data) {
                            // console.log({data});
                        }
                    });
                },
                error: function (data) {
                    // console.log({data});
                }
            });
        },
        error: function (data) {
            // console.log({data});
        }
    });
}
function loadMessagesFromClickedUser() {
    var contact = $('.contact');
    $(contact).on("click", function (e) {
        e.preventDefault();

        $(".right-sidebar").attr("style", "visibility: visible;"); // a contact is selected

        let user_id = $(this).find("[data-id_user]").attr("data-id_user")
        let username = $(this).find("p.username").text()
        let profile_img = $(this).closest('.contact').find('img').attr("src")
        $("#id_selected_user").attr('data-id_selected_user', user_id)
        $("#id_selected_user > p").html(username)
        $("#id_selected_user > img").attr('src', profile_img)
        
        const prevColor = $(this).closest('.contact').css("background-color")
        $(".contact").css("background-color", prevColor) // default color for all
        $(this).closest('.contact').css("background-color", "darkgrey") // change color for selected

        $(".msger-chat").empty() // clear previous chat log
        loadMessages()
    })
}