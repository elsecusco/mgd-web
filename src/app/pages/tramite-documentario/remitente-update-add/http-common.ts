import axios from 'axios';

export default axios.create({
  baseURL: "https://mwsdev.else.com.pe/servicio-mesa-partes-virtual/api/",
  headers: {
    "Content-type": "application/json",
  },
});
