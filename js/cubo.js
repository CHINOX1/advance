let currentForm = 0;

function updateForm(wrapper) {
    wrapper.style.transform = `rotateY(${currentForm * -90}deg)`;
}
