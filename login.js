const users = {

    farm001: {

        password: "123456",

        farmId: "FARM-0007"

    },

    farm002: {

        password: "abcdef",

        farmId: "FARM-0008"

    }

};

function login(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (

        users[username] &&

        users[username].password === password

    ) {

        sessionStorage.setItem(
    "farmId",
    users[username].farmId
);

        window.location.href =

            "index.html";

    }

    else {

        document.getElementById("error")

            .innerText =

            "Invalid username or password";

    }

}

///yha se password section ko acha banane k liye eye................................................ ///

const togglePassword =
    document.getElementById("togglePassword");

const password =
    document.getElementById("password");

togglePassword.addEventListener("click", function () {

    const type =
        password.type === "password"
            ? "text"
            : "password";

    password.type = type;

    this.innerHTML =
        type === "password"
            ? '<i class="fa-solid fa-eye"></i>'
            : '<i class="fa-solid fa-eye-slash"></i>';
            password.focus();

});

document.getElementById("loginForm").addEventListener("submit", login);