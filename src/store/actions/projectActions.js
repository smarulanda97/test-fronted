import { GET_PROJECT_INFO  } from "./../types/projectTypes";
import {fetchProjectInfo} from "../../utils/api";

export const getProjectInfo = () => async(dispatch) => {
  try {
    const data = await fetchProjectInfo();
    dispatch({ type: GET_PROJECT_INFO, payload: data });
  } catch (e) {

  } finally {

  }
};
