import axios from 'axios';

const BETS_URL = "http://localhost:3000/paris";

export const chargerParis = async () => {
  try {
      const response = await axios.get(BETS_URL);

      return response.data;
  } catch (e) {
      console.error(e);
  }
};

export const ajouterPari = async (username, form) => {

  if (!username || !form.cheval) return;

  try {
      await axios.post(BETS_URL, {
          auteur: username,
          cheval: form.cheval,
      });
  } catch (e) {
      console.error(e);
  }
};

export const genererPari = async () => {
  try {
      await axios.post(`${BETS_URL}/generate`);
  } catch (e) {
      console.error(e);
  }
};

export const supprimerPari = async id => {
  try {
      await axios.delete(`${BETS_URL}/${id}`);
  } catch (e) {
      console.error(e);
  }
};

export const supprimerParis = async () => {
  try {
      await axios.delete(`${BETS_URL}`);
  } catch (e) {
      console.error(e);
  }
};