let users = [];
let albums = [];

console.log(`Puede hacer getUser() llamando a:
- forma1 (Async/Await)
- forma2 (Promesas)
- forma3 (Ajax)

Puedo hacer getAlbums(id) llamando a:
- forma1 (Async/Await)
- forma2 (Promesas)
- forma3 (Ajax)`);

// Método que elimina las propiedades phone, zipcode y lat.
function deleteProps(array) {
  users = [];
  array.map((date) => {
    const {
      phone,
      address: { zipcode, ...restAdress },
      address: {
        geo: { lat, ...restGeo },
      },
      ...rest
    } = date;
    const geo = restGeo;
    const address = { ...restAdress, geo };
    const newObj = { ...rest, address };
    users.push(newObj);
  });
}

async function getUsers(callback) {
  // En caso de que sea la forma2, que ejecute la promesa con then
  if (callback == forma2) {
    await callback()
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        deleteProps(data);
        console.log("Usuarios: ", users);
      })
      .catch((e) => console.log(e));
  } else {
    await callback();
  }
}

async function getAlbums(id, callback) {
  if (callback == forma2) {
    // Ejecución de la promesa
    await callback(id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return (albums = data);
      })
      .then((albums) => console.log("Álbumes: ", albums))
      .catch((e) => console.log(e));
  } else {
    await callback(id);
  }
}

// Llamando a la api con async/await y bloque try-catch
const forma1 = async (id) => {
  console.log("Ejecutando forma 1");
  // En caso de que exista un id, quiere decir que se esta llamando a un album, caso contrario, llama al api de users
  if (id) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}/albums`
      );
      const data = await response.json();
      albums = data;
      console.log("Álbumes: ", albums);
    } catch (error) {
      return error;
    }
  } else {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      deleteProps(data);
      console.log("Usuarios: ", users);
    } catch (error) {
      return error;
    }
  }
};

// Llamando a la api con promesas
const forma2 = (id) => {
  console.log("Ejecutando forma 2");
  // En caso de que exista un id, quiere decir que se esta llamando a un album, caso contrario, llama al api de users

  if (id) {
    return new Promise((resolve, reject) => {
      const response = fetch(
        `https://jsonplaceholder.typicode.com/users/${id}/albums`
      );
      if (response) {
        resolve(response);
      } else {
        reject("Error");
      }
    });
  }

  return new Promise((resolve, reject) => {
    const response = fetch("https://jsonplaceholder.typicode.com/users");
    if (response) {
      resolve(response);
    } else {
      reject("Error");
    }
  });
};

// Llamando a la api con Ajax (Objeto XMLHttpRequest)
const forma3 = (id) => {
  console.log("Ejecutando forma 3");
  // En caso de que exista un id, quiere decir que se esta llamando a un album, caso contrario, llama al api de users
  if (id) {
    let xhttp = new XMLHttpRequest();
    xhttp.open(
      "GET",
      `https://jsonplaceholder.typicode.com/users/${id}/albums`
    );
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        albums = response;
        console.log("Álbumes: ", albums);
      }
    };
  } else {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://jsonplaceholder.typicode.com/users");
    xhttp.send();
    xhttp.onreadystatechange = function () {
      // Validacion para comprobar si la respuesta fue exitosa
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        deleteProps(response);
        console.log("Usuarios: ", users);
      }
    };
  }
};
