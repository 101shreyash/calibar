async function RateLimitCheck() {

  while (true) {

    const name = "980547354";
    const value = Math.floor(Math.random() * 1000000);


    const obj = {
      phonenumber: `${name}${value}`,
      password: "RandomPassword",
    };

    const result = await fetch("http://localhost:8001/signup", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },

    });

    const data = await result.json();
    console.log(data);
  }
}

RateLimitCheck();
