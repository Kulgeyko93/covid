
export class ChartAll {
   constructor({countryHistory, historyAll, allCountries, allCases }) {
      this.countryHistory = countryHistory;
      this.historyAll= historyAll;
      this.allCountries =allCountries;
      this.allCases = allCases
      this.getData('Global cases');
   }

   getData(parametr, country) {
      let label = [];
      let labelData = [];
      let isCityParameter = '';
      let api = this.countryHistory;
      if ( country === undefined) {
         api = this.historyAll;
      }
   
      
      switch (true) {
            case (parametr === "Global cases"): {
               if (country === undefined || country === null) {
                  isCityParameter ="Global cases";
                  for (let i in api.cases) {
                     label.push(i)
                     labelData.push(api.cases[i])
                  }
               } else {
                  isCityParameter =`Global cases ${country}`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        for (let i in item.timeline.cases) {
                           label.push(i)
                           labelData.push(item.timeline.cases[i])
                        }
                     }
                  })
               }
               break
            }
            case (parametr === "Global deaths"): {
               isCityParameter ='Global deaths';
               if (country === undefined || country === null) {
                  for (let i in api.deaths) {
                     label.push(i)
                     labelData.push(api.deaths[i])
                  }
               } else {

                  api.forEach((item) => {
                     isCityParameter =`Global deaths ${country}`;
                     if (item.country === country) {
                        for (let i in item.timeline.deaths) {
                           label.push(i)
                           labelData.push(item.timeline.deaths[i])
                        }
                     }
                  })
               }
               break
            }
            case (parametr === "Global recovered"): {
               isCityParameter =`Global recovered`;
               if (country === undefined || country === null) {
                  for (let i in api.recovered) {
                     label.push(i)
                     labelData.push(api.recovered[i])
                  }
               } else {
                  isCityParameter =`Global recovered ${country}`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        for (let i in item.timeline.recovered) {
                           label.push(i)
                           labelData.push(item.timeline.recovered[i])
                        }
                     }
                  })
               }
               break
            }
            case (parametr === "Global cases per 100000"): {
               isCityParameter =`Global cases per 100000`;
               if (country === undefined || country === null) {
                  for (let i in api.cases) {
                     label.push(i)
                     labelData.push((api.cases[i] / this.allCases.population * 100000).toFixed(2))
                  }
               } else {
                  isCityParameter =`Global cases ${country} per 100000`;
                  let countryPopulation;
                  this.allCountries.forEach((item) => {
                     
                     if (item.country === country) {
                        countryPopulation = item.population;
                     }
                  })
                  api.forEach((item) => {
                     if (item.country === country) {
                        for (let i in item.timeline.cases) {
                           label.push(i)
                           labelData.push((item.timeline.cases[i] / countryPopulation *100000).toFixed(2))
                        }
                     }
                  })
               }
               break
            }
            case (parametr === "Global deaths per 100000"): {
               isCityParameter =`Global deaths per 100000`;
               if (country === undefined || country === null) {
                  for (let i in api.deaths) {
                     label.push(i)
                     labelData.push((api.deaths[i] / this.alldeaths.population * 100000).toFixed(2))
                  }
               } else {
                  isCityParameter = `Global deaths ${country} per 100000`;
                  this.allCountries.forEach((item) => {
                     if (item.country === country) {
                        countryPopulation = item.population;
                     }
                  })
                  api.forEach((item) => {
                     if (item.country === country) {
                        for (let i in item.timeline.deaths) {
                           label.push(i)
                           labelData.push((item.timeline.deaths[i] / countryPopulation *100000).toFixed(2))
                        }
                     }
                  })
               }
               break
            }
            case (parametr === "Global recovered per 100000"): {
               isCityParameter =`Global recovered per 100000`;
               if (country === undefined || country === null) {
                  for (let i in api.recovered) {
                     label.push(i)
                     labelData.push((api.recovered[i] / this.allrecovered.population * 100000).toFixed(2))
                  }
               } else {
                  isCityParameter =`Global recovered ${country} per 100000`;
                  this.allCountries.forEach((item) => {
                     if (item.country === country) {
                        countryPopulation = item.population;
                     }
                  })
                  api.forEach((item) => {
                     if (item.country === country) {
                        for (let i in item.timeline.recovered) {
                           label.push(i)
                           labelData.push((item.timeline.recovered[i] / countryPopulation *100000).toFixed(2))
                        }
                     }
                  })
               }
               break
            }
            case (parametr === "Last day cases"): {
               isCityParameter =`Last day cases`;
               if (country === undefined || country === null) {
                     label.push(["Last day cases"])
                     labelData.push([this.allCases.todayCases])
               } else {
                  isCityParameter =`Last day cases ${country}`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        label.push([`Last day cases ${country} `])
                        labelData.push([this.allCountries.todayCases])
                     }
                  })
               }
               break
            }
            case (parametr === "Last day deaths"): {
               isCityParameter =`Last day deaths`;
               if (country === undefined || country === null) {
                     label.push(["Last day deaths"])
                     labelData.push([this.allCases.todayDeaths])
               } else {
                  isCityParameter =`Last day deaths ${country}`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        label.push([`Last day deaths ${country}`])
                        labelData.push([this.allCountries.todayDeaths])
                     }
                  })
               }
               break
            }
            case (parametr === "Last day recovered"): {
               isCityParameter =`Last day recovered`;
               if (country === undefined || country === null) {
                     label.push(["Last day recovered"])
                     labelData.push([this.allCases.todayRecovered])

               } else {
                  isCityParameter =`Last day recovered ${country}`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        label.push([`Last day recovered ${country}`])
                        labelData.push([this.allCountries.todayRecovered])
                     }
                  })
               }
               break
            }
            case (parametr === "Last day cases per 100000"): {
               isCityParameter =`Last day cases per 100000`;
               if (country === undefined || country === null) {
                     label.push(["Last day cases per 100000"])
                     labelData.push([(this.allCases.casesPerOneMillion/10).toFixed(2)])

               } else {
                  isCityParameter =`Last day cases ${country} per 100000`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        label.push([`Last day cases ${country}`])
                        labelData.push([(this.allCountries.casesPerOneMillion/10).toFixed(2)])
                     }
                  })
               }
               break
            }
            case (parametr === "Last day deaths per 100000"): {
               isCityParameter =`Last day deaths per 100000`;
               if (country === undefined || country === null) {
                     label.push(["Last day deaths per 100000"])
                     labelData.push([(this.allCases.deathsPerOneMillion/10).toFixed(2)])

               } else {
                  isCityParameter =`Last day deaths ${country} per 100000`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        label.push([`Last day deaths ${country}`])
                        labelData.push([(this.allCountries.deathsPerOneMillion/10).toFixed(2)])
                     }
                  })
               }
               break
            }
            case (parametr === "Last day recovered per 100000"): {
               isCityParameter =`Last day recovered per 100000`;
               if (country === undefined || country === null) {
                     label.push(["Last day recovered per 100000"])
                     labelData.push([(this.allCases.recoveredPerOneMillion/10).toFixed(2)])

               } else {
                  isCityParameter =`Last day recovered ${country} per 100000`;
                  api.forEach((item) => {
                     if (item.country === country) {
                        label.push([`Last day recovered ${country}`])
                        labelData.push([(this.allCountries.recoveredPerOneMillion/10).toFixed(2)])
                     }
                  })
               }
               break
            }
      }
      return this.render(isCityParameter,label,labelData);
   }

   render(param, info, data) {
      document.getElementById('myChart').remove()
      document.querySelector('.diagram').innerHTML = '<canvas id="myChart"></canvas>'
      let ctx = document.getElementById('myChart').getContext('2d');
      let chart = new Chart(ctx, {
         type: 'line',
         data: {
            labels: [...info],
            datasets: [{
               label: param,
               backgroundColor: 'rgb(255, 99, 132)',
               borderColor: 'rgb(255, 99, 132)',
               data: [...data]
            }]
         },
         options: {}
      });
   }
}

