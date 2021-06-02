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
});