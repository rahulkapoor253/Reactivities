import axios, { AxiosResponse } from "axios";
import { IActivity, IActivitiesEnvelope } from "../models/Activity";
import { history } from "../..";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/user";
import { IProfile, IPhoto } from "../models/Profile";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

//intercept each request to bind jwt
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//intercept response errors
axios.interceptors.response.use(undefined, (error) => {
  //throw error which is catched in the api call in store
  //console.log(error.response);
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network Error");
  }
  const { status, data, config, headers } = error.response;
  if (status === 404) {
    history.push("/notfound");
  }
  if (
    status === 401 &&
    headers["www-authenticate"].includes("The token expired")
  ) {
    console.log(error.response);
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.info("Your session has expired, login again");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server error");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    axios.get("/activities", { params: params }).then(responseBody),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.delete(`/activities/${id}/attend`),
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/register", user),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profile/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postForm("/photo", photo),
  setMainPhoto: (id: string) => requests.post(`/photo/${id}/setmain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photo/${id}`),
  updateProfile: (profile: Partial<IProfile>) =>
    requests.put("/profile", profile),
  follow: (username: string) =>
    requests.post(`/profile/${username}/follow`, {}),
  unfollow: (username: string) =>
    requests.delete(`/profile/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    requests.get(`profile/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    requests.get(`/profile/${username}/activities?predicate=${predicate}`),
};

export default {
  Activities,
  User,
  Profiles,
};
