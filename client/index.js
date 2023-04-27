const productDescription = document.getElementById("product-description");

const beer3Button = document.getElementById("donate-3");
const beer5Button = document.getElementById("donate-5");
const beer10Button = document.getElementById("donate-10");

const amountInput = document.getElementById("amount-input");
const totalAmount = document.getElementById("total-amount");

let beerCount = 0;

beer3Button.addEventListener("click", () => {
  amountInput.value = 3;
  beerCount = 3;
  updateTotalAmount();
});

beer5Button.addEventListener("click", () => {
  amountInput.value = 5;
  beerCount = 5;
  updateTotalAmount();
});

beer10Button.addEventListener("click", () => {
  amountInput.value = 10;
  beerCount = 10;
  updateTotalAmount();
});

amountInput.addEventListener("input", () => {
  beerCount = amountInput.value;
  updateTotalAmount();
});

const updateTotalAmount = () => {
  const updatedAmount = beerCount * 50;
  totalAmount.innerText = updatedAmount;
};

//MP
const mercadopago = new MercadoPago("PUBLIC_KEY", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

document.getElementById("checkout-btn").addEventListener("click", function () {
  const orderData = {
    quantity: 1,
    description: productDescription.innerText,
    price: totalAmount.innerText,
  };

  fetch("http://localhost:8080/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (preference) {
      createCheckoutButton(preference.id);
    })
    .catch(function () {
      alert("Unexpected error");
    });
});

function createCheckoutButton(preferenceId) {
  // Initialize the checkout
  const bricksBuilder = mercadopago.bricks();

  const renderComponent = async (bricksBuilder) => {
    if (window.checkoutButton) window.checkoutButton.unmount();

    await bricksBuilder.create(
      "wallet",
      "button-checkout", // class/id where the payment button will be displayed
      {
        initialization: {
          preferenceId: preferenceId,
        },
        callbacks: {
          onError: (error) => console.error(error),
          onReady: () => {},
        },
      }
    );
  };
  window.checkoutButton = renderComponent(bricksBuilder);
}
