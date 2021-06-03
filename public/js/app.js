import axios from 'axios';
import Swal from 'sweetalert2';

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
                console.log(data)
                Swal.fire(
                    'Profile saved successfully',
                    "",
                    'success'
                ).then(function () {
                    window.location.reload()
                });
            },
            error: function (data) {
                console.log(data);
                Swal.fire(
                    'Error saving profile',
                    "",
                    'error'
                ).then(function() {
                    window.location.reload()
                });
            }
        });
    });
});