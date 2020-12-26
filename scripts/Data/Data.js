
export const getAllCases = async () => await fetch("https://disease.sh/v3/covid-19/all")
                                             .then(response => response.json())
                                             .catch(error => console.log(error));
export const getCountries = async () => await fetch("https://disease.sh/v3/covid-19/countries")
                                             .then(response => response.json())
                                             .catch(error => console.log(error));   
export const getHistory = async () => await fetch("https://disease.sh/v3/covid-19/historical")
                                             .then(response => response.json())
                                             .catch(error => console.log(error));   
export const getHistoryAll = async () => await fetch("https://disease.sh/v3/covid-19/historical/all")
                                             .then(response => response.json())
                                             .catch(error => console.log(error));  
