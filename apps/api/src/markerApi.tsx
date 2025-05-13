import axios from "axios";
import { Types } from "mongoose";
import { serverUrl } from "./configs/accessCodeServer";
import ILocation from "./interfaces/ILocation.mjs";

/**
 * Adds a new marker with the provided location data.
 * @param {ILocation} location - The location object containing the marker data to be added.
 * @param {string} userToken - The user token for authentication.
 * @returns {Promise<ILocation>} A promise that resolves to the newly added location object.
 * @throws {string} Throws an error message if an error occurs during the addition process.
 */
export async function addLocation(
  location: ILocation,
  userToken?: string | null
): Promise<ILocation> {
  if (!userToken) throw new Error("User token is required");

  try {
    const response = await axios.post<ILocation>(
      new URL("locations", serverUrl).toString(),
      location,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newLocation = {
      ...response.data,
      lastModified: new Date(response.data.lastModified!),
      created: new Date(response.data.created!),
    };

    return newLocation;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves all available locations. The locations are modified to include Date objects instead of strings.
 * @param {string} userToken - The user token for authentication.
 * @returns {Promise<ILocation[]>} A promise that resolves to an array of ILocation objects.
 * @throws {string} Throws an error message if an error occurs during the retrieval process.
 * @throws {string} Throws an error message if the user token is not provided or is invalid.
 **/
export async function getLocations(
  userToken?: string | null
): Promise<ILocation[]> {
  if (!userToken) throw new Error("User token is required");

  try {
    const response = await axios.get<ILocation[]>(
      new URL("locations", serverUrl).toString(),
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const locations = response.data.map((location) => ({
      ...location,
      lastModified: new Date(location.lastModified!),
      created: new Date(location.created!),
    }));

    return locations;
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes the marker with the specified ID.
 * @param {Types.ObjectId} id - The ID of the marker to be deleted.
 * @param {string} userToken - The user token for authentication.
 * @returns {Promise<string>} A promise that resolves when the marker is successfully deleted.
 * @throws {string} Throws an error message if an error occurs during the deletion process.
 */
export async function removeLocation(
  id: Types.ObjectId,
  userToken?: string | null
): Promise<void> {
  if (!userToken) throw new Error("User token is required");

  try {
    await axios.delete(new URL(`locations/${id}`, serverUrl).toString(), {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the location with the provided data.
 * @param {ILocation} location - The location object containing the updated data.
 * @param {string} userToken - The user token for authentication.
 * @returns {Promise<ILocation>} A promise that resolves to the updated Ilocation details on success.
 * @throws {string} Throws an error message if an error occurs during the update process.
 */
export async function updateLocation(
  location: ILocation,
  userToken?: string | null
): Promise<ILocation> {
  if (!userToken) throw new Error("User token is required");

  try {
    const response = await axios.put(
      new URL(`/locations/${location._id!}`, serverUrl).toString(),
      location,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const updatedLocation = {
      ...response.data,
      lastModified: new Date(response.data.lastModified!),
      created: new Date(response.data.created!),
    };

    return updatedLocation;
  } catch (error) {
    throw error;
  }
}
