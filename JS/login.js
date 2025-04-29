const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');

    function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const error = document.getElementById('login-error');

      if (email === "admin@gmail.com" && password === "admin123456") {
        sessionStorage.setItem("loggedIn", true);
        showDashboard();
      } else {
        error.style.display = "block";
      }
    }
    function logout() {
        sessionStorage.removeItem("loggedIn");
        document.getElementById('dashboard').style.display = "none";
        document.getElementById('login-screen').style.display = "flex";
      }
      
      function showDashboard() {
        document.getElementById('login-screen').style.display = "none";
        document.getElementById('dashboard').style.display = "block";

        showPage('objects');
        loadObjects();
      }

    window.onload = () => {
        if (sessionStorage.getItem("loggedIn")) {
          showDashboard();
        }
    }