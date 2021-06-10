import axios from 'axios';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

document.addEventListener('DOMContentLoaded', () => {
    // window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $('#login-form').on('submit', function (e) {
        e.preventDefault(); // not submit
        // const email = document.getElementById('email').value;
        // const password = document.getElementById('password').value;
        // const { data } = await axios('/api/user/login' + username)

        var datos = $(this).serialize();

        $.ajax({
            type: $(this).attr('method'),
            data: datos,
            url: $(this).attr('action'),
            dataType: 'json',
            success: function (data) {
                // console.log(data)
                if (data.status == 200) {
                    // const authToken = data.body.token
                    // localStorage.setItem("_authToken", data.body.token) // Node.js doesn't have localStorage
                    Swal.fire(
                        'User logged in successfully',
                        data.message,
                        'success'
                    ).then(function() {
                        // $.ajax({
                        //     url: "/home",
                        //     type: 'GET',
                        //     headers: { "Authorization": `Bearer ${authToken}` },
                        //     success: function (data) {
                        //         $("html").html(data) // methods not found in console...
                        //     }
                        // });
                        window.location.href = '/home';
                    });
                }
            },
            error: function (data) {
                console.log(data);
                if (data.status == 400) {
                    Swal.fire(
                        'Error authenticating user',
                        data.responseJSON.message,
                        'error'
                    );
                }
            }
        });
    });

    $('#register-form').on('submit', function (e) {
        e.preventDefault(); // not submit

        const $this_ref = $(this)
        var datos = $(this).serialize();

        $.ajax({
            type: $(this).attr('method'),
            data: datos,
            url: $(this).attr('action'),
            dataType: 'json',
            success: function (data) {
                // console.log(data)
                if (data.status == 200) {
                    Swal.fire(
                        'User registered successfully',
                        data.message,
                        'success'
                    ).then(function() {
                        $this_ref.trigger('reset')
                    });
                }
            },
            error: function (data) {
                // console.log(data);
                if (data.status == 400) {
                    Swal.fire(
                        'Error registering user',
                        data.responseJSON.message,
                        'error'
                    );
                }
            }
        });
    });

    // $("#file_input").on('change', function (e) {
    //     // $('#user_profile_picture_form').submit(); // when pressing back arrow in browser it doesn't go back (when file upload fails)
    // });

    $('#user_profile_form').on('submit', function (e) {
        e.preventDefault(); // not submit

        // let datos = $(this).serializeArray(); // jQuery.serialize() serializes only input elements, not the "file" data in them.
        // datos.push({ name: "profile_image_upload", value: fileName });

        const profile_status = document.getElementById("profile_status").value
        const file = $('#file_input')[0].files[0]
        var datos = new FormData()
        datos.append('profile_status', profile_status)
        datos.append('profile_image_upload', file)

        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: datos,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                // console.log(data) // full html page
                Swal.fire(
                    'Profile saved successfully',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload()
                });
            },
            error: function (data) {
                // console.log(data);
                const doc = document.createElement("div");
                doc.innerHTML = data.responseText;
                const errorMessage = doc.querySelector("h1").innerHTML

                Swal.fire(
                    'Error saving profile',
                    errorMessage,
                    'error'
                ).then(function() {
                    window.location.reload()
                });
            }
        });
    });

    // BARBERSHOP

    var servicesWrapper = $(".services_wrap");
    var addServiceBtn = $(".add_service_button");
    // let numberOfServices = 0;
    $(addServiceBtn).on("click", function (e) {
        e.preventDefault();
        let numberOfServices = $(".fa-trash").length
        numberOfServices++
        let myUUID = uuidv4()
        $(servicesWrapper).append(`
            <div class="form-group w3-margin-bottom w3-border w3-border-gray w3-padding w3-col s12 m6 l4">
                <label for="" class="w3-margin-right">Service ${numberOfServices}</label>
                <div class="removeService fas fa-trash w3-right" id="${myUUID}"></div><br><br>
                <label for="">Title</label>
                <input type="text" class="w3-input" name="myServices[${myUUID}][service_title]"><br>
                <label for="">Description</label>
                <input type="text" class="w3-input" name="myServices[${myUUID}][service_description]"><br>
                <label for="">Price</label>
                <input type="text" class="w3-input" name="myServices[${myUUID}][service_price]">
            </div>
        `);
    });
    $(servicesWrapper).on("click", ".removeService", function (e) { //user click on remove text
        e.preventDefault();
        // numberOfServices-- // to not duplicate the number, when a service is removed and added again

        if (confirm("Are you sure you want to delete this item?")) {
            const serviceID = $(this).attr("id")
            // console.log({serviceID})
            // const serializedData = {
                // name: "serviceID", 
                // value: serviceID
            // }

            $.ajax({
                type: "POST",
                data: {serviceID},
                url: "/api/barbershop/my-barbershop/delete-service",
                dataType: 'json',
                success: function (data) {
                    // console.log(data)
                },
                error: function (data) {
                    // console.log(data);
                }
            })

            $(this).parent('div').remove();
        }
    })
    $('#my-barbershop-form').on('submit', function (e) {
        e.preventDefault(); // not submit

        var datos = $(this).serializeArray();
        // console.log(datos)

        $.ajax({
            type: $(this).attr('method'),
            data: datos,
            url: $(this).attr('action'),
            dataType: 'json',
            success: function (data) {
                // console.log(data)
                if (data.status == 200) {
                    Swal.fire(
                        'Barbershop/Services registered successfully',
                        data.message,
                        'success'
                    )
                }
            },
            error: function (data) {
                console.log(data);

                let errorMessage = ''

                // if (Array.isArray(data.responseJSON.body)) {
                    let errors = []
                    errorMessage = '<ul style="list-style:none;">'
                    data.responseJSON.body.forEach(item => {
                        if (!errors.includes(item.error)) { // JOI has a duplicate error message for e.g. Service price is required and only accepts numbers
                            errors.push(item.error) // make more error-friendly message
                            errorMessage += `<li><b>${item.error}</b></li>`
                        }
                    })
                    errorMessage += '</ul>'
                // } else if ((typeof data.responseJSON.body === "object" || typeof data.responseJSON.body === 'function') && (data.responseJSON.body !== null)) {
                    // errorMessage = data.responseJSON.message // default error messages
                // }
                if (data.status == 400) {
                    Swal.fire(
                        'Error saving barbershop',
                        errorMessage,
                        // data.responseJSON.message,
                        'error'
                    );
                }
            }
        });
    });
});