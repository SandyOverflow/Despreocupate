document.addEventListener('DOMContentLoaded', () => {
    //Mostrar u ocultar contraseña:
    const togglePwd = document.getElementById('toggle-pwd');
    const passwordInput = document.getElementById('password');

    if (togglePwd && passwordInput) {
        togglePwd.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePwd.classList.toggle('fa-eye');
            togglePwd.classList.toggle('fa-eye-slash');
        });
    }

    //Desplegable
    const selectSelected = document.getElementById('select-selected');
    const selectItems = document.getElementById('select-items');

    if (selectSelected && selectItems) {
        selectSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            selectItems.classList.toggle('select-hide');
        });

        selectItems.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', () => {
                selectSelected.querySelector('span').innerText = item.innerText;
                selectItems.classList.add('select-hide');
            });
        });

        window.addEventListener('click', () => {
            selectItems.classList.add('select-hide');
        });
    }
});
