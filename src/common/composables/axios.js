import axios from "axios";

const gistAxios = axios.create({
  baseURL: "http://localhost:3044/gist/api/v1",
  withCredentials: true,
});

gistAxios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { data } = response;

      return {
        ...data,
        status: 200,
      };
    }

    return response;
  },
  (error) => {
    const { response } = error;

    const { data } = response;

    let errorMsg = null;

    if (!data) {
      errorMsg = "Could not connect. Please refresh and try again";
    }

    if (response.status === 400) {
      errorMsg = data;
    }

    if ([429, 404, 403, 401, 500].includes(response.status)) {
      errorMsg = data;
    }

    if (data && data.errors) {
      errorMsg = data.errors[0];
    }

    return Promise.reject(errorMsg || data.message);
  }
);

export function useAxios() {
  return gistAxios;
}
