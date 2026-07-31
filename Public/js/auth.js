document.addEventListener("DOMContentLoaded",()=>{
  const loginForm = document.querySelector("#loginForm");
  const alertBox = document.querySelector(".alert");

  if (!loginForm) return;
  
  loginForm.addEventListener("submit", async(e)=>{
    e.preventDefault(); 
    
    try {      
      const formData = {
        email:loginForm.email.value,
        password:loginForm.password.value
      }     
      
      const res = await fetch("/api/auth",{     
        method:"POST",   
        headers:{"Content-type": "application/json"},
        body:JSON.stringify(formData)
      });             

      const data = await res.json();   

      if (data.success) {
        alertBox.classList.add("alert-success");
        alertBox.textContent = data.message;

        //localStorage stores user data to be used in .js files
        localStorage.setItem("token", data.token);

        setTimeout(()=>{
          window.location.href = "/dashboard.html";
        }, 1000);
      } else {
        alertBox.classList.add("alert-danger");
        alertBox.textContent = data.message;

         setTimeout(()=>{
          alertBox.remove();
        }, 1000);     
      }
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  });
});