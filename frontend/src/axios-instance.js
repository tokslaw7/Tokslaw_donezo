import axios from "axios";
import supabase from "./client";

const getAxiosClient = async () => {

    const currentSession = await supabase.auth.getSession();

    const instance = axios.create({
        headers: {
            Authorization: `Bearer ${currentSession.data.session.access_token}`,
        },
    });

    return instance;
  // Get the supabase session
  // create an axios instance with the supabase access_token
  // Return the instance
  // Fill code here
};

export default getAxiosClient;
