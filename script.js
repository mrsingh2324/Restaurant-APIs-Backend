const fullName = document.getElementById("fname");
const mail = document.getElementById("mail");
const password = document.getElementById("password");

const loginMail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const resetMail = document.getElementById("resetEmail");
const resetName = document.getElementById("resetName");
const newPassword = document.getElementById("newPassword");

const filterAddress = document.getElementById("filterAddress");
const filterFoodType = document.getElementById("filterFoodType");

const restoName = document.getElementById("restoName");
const restoLocation = document.getElementById("restoName");
const restoFoodType = document.getElementById("restoName");

// const filteredResults =document.getElementById("filteredResults");

function login() {
  console.log(loginMail.value, loginPassword.value);
  const loginData = {
    loginMail: loginMail.value,
    loginPassword: loginPassword.value,
  };
  axios
    .post("http://localhost:3001/login", loginData)
    .then((result) => {
      alert(result.data.message);
      // loginMail.value = ""
      // loginPassword.value = ""
    })
    .catch((err) => {
      console.log(err);
    });
}

function signUp() {
  console.log(fullName.value, mail.value, password.value);

  const signupData = {
    fullName: fullName.value, // modified property name
    email: mail.value,
    password: password.value,
  };

  axios
    .post(`http://localhost:3001/signup`, signupData)
    .then((result) => {
      alert(result.data.message);

      // fullName.value = "";
      // mail.value = "";
      // password.value = "";
    })
    .catch((err) => {
      console.log(err);
    });
}

function resetPassword() {
  const resetData = {
    fullName: resetName.value, // modified property name
    email: resetMail.value,
    newPassword: newPassword.value,
  };

  axios
    .post(`http://localhost:3001/resetPassword`, resetData)
    .then((result) => {
      alert(result.data.message);
      // resetName.value = ""
      // resetMail.value = ""
      // newPassword.value = ""
    })
    .catch((err) => {
      console.log(err);
    });
}
function addRestaurant() {
  const restaurantName = document.getElementById("restaurantName").value;
  const restaurantImage = document.getElementById("restaurantImage").value;
  const address = document.getElementById("address").value;
  const contact = document.getElementById("contact").value;
  const rating = document.getElementById("rating").value;
  // const foodItems = getFoodItems();
  if (
    !restaurantName &&
    !restaurantImage &&
    !address &&
    !contact &&
    !rating &&
    foodItems.length === 0
  ) {
    if (foodItems.every((item) => !item.name && !item.price && !item.quantity)) {
      alert("Please fill in the restaurant details.");
      return;
    }
  }
  const restaurantDetails = {
    restaurantName,
    restaurantImage,
    details: {
      address,
      contact,
      rating,
    },
    // foodItems,
  };

  axios
    .post("http://localhost:3001/addResto", restaurantDetails)
    .then((result) => {
      alert(result.data.message);
    })
    .catch((err) => {
      console.log(err);
    });
}
// Rest of your code
function filter() {
  const location = filterAddress.value;
  const foodType = filterFoodType.value;

  let params = "";

  if (location && foodType) {
    params = `location=${location}&foodType=${foodType}`;
  } else if (location) {
    params = `location=${location}`;
  } else if (foodType) {
    params = `foodType=${foodType}`;
  }

  axios
    .get(`http://localhost:3001/getResto?${params}`)
    .then((result) => {
      const filteredResultsDiv = document.getElementById("filteredResults");
      filteredResultsDiv.innerHTML = ""; // Clear previous results

      if (result.data.result && result.data.result.length > 0) {
        result.data.result.forEach((restaurant) => {
          const restaurantName = document.createElement("h3");
          restaurantName.textContent = restaurant.restaurantName;
          filteredResultsDiv.appendChild(restaurantName);

          // Add other relevant information about the restaurant as desired
          // You can create additional elements and append them to the filteredResultsDiv
        });
      } else {
        const noResultsMsg = document.createElement("p");
        noResultsMsg.textContent =
          "No restaurants found for the given filters.";
        filteredResultsDiv.appendChild(noResultsMsg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
