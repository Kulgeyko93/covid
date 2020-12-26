
export class Map {
   constructor(allCountries, chooseCountry, showChart, setCity) {
      this.parameter = 'Global cases'
      this.chooseCountry = chooseCountry
      this.allCountries = allCountries;
      this.showChart = showChart; 
      this.setCity = setCity;
      this.getMap('Global cases');
   }
   renderNewParam(parametr) {
      this.parameter = parametr ;
      document.querySelector('#map-world').innerHTML = `<svg id="map-world"></svg>`
      this.getMap (this.parameter)
   }

   loadAndProcessData() {
      return Promise
      .all([
         d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
         d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
      ])
      .then(([tsvData, topoJSONdata]) => {
         const rowById = tsvData.reduce((accumulator, d) => {
            accumulator[d.iso_n3] = d;
            return accumulator;
         }, {});
         const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
         countries.features.forEach(d => {
            Object.assign(d.properties, rowById[d.id]);
         });

         return countries;
      });
   }


   colorLegend (selection, props) {
      const {                      
         colorScale,                
         circleRadius,
         spacing,                   
         textOffset,
         backgroundRectWidth,
         selectedColorValue
      } = props;                   
      
      const backgroundRect = selection.selectAll('rect')
         .data([null]);             
      const n = colorScale.domain().length; 
      backgroundRect.enter().append('rect')
         .merge(backgroundRect)
            .attr('x', -circleRadius * 2)   
            .attr('y', -circleRadius * 2)   
            .attr('rx', circleRadius * 2)   
            .attr('width', backgroundRectWidth)
            .attr('height', spacing * n + circleRadius * 2) 
            .attr('fill', 'white')
            .attr('opacity', 0.8);
      const groups = selection.selectAll('.tick')
         .data(colorScale.domain());
      const groupsEnter = groups
         .enter().append('g')
            .attr('class', 'tick');
      groupsEnter
         .merge(groups)
            .attr('transform', (d, i) =>    
            `translate(0, ${i * spacing})`  
            )
            .attr('opacity', d =>
            (!selectedColorValue || d === selectedColorValue)
               ? 1
               : 0.2
            )
      groups.exit().remove();
      groupsEnter.append('circle')
         .merge(groups.select('circle')) 
            .attr('r', circleRadius)
            .attr('fill', colorScale); 
      groupsEnter.append('text')
         .merge(groups.select('text'))   
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset);
   }

   choroplethMap (selection, props) {
      const width = document.querySelector('#map-world').clientWidth;
      const height = document.querySelector('#map-world').clientHeight;
      const {
         features,
         colorScale,
         colorValue,
         changeCountry,
         selectedColorValue
      } = props;

      const projection = d3.geoEquirectangular() 
                           .scale(100)
                           .translate([width / 2, height / 2]);
      const pathGenerator = d3.geoPath().projection(projection);
      const gUpdate = selection.selectAll('g').data([null]);
      const gEnter = gUpdate.enter().append('g');
      const g = gUpdate.merge(gEnter);

      gEnter
         .append('path')
            .attr('class', 'sphere')
            .attr('d', pathGenerator({type: 'Sphere'}))
            
         .merge(gUpdate.select('.sphere'))
            .attr('opacity', selectedColorValue ? 0.05 : 1);
      selection.call(d3.zoom().on('zoom', () => {
         g.attr('transform', d3.event.transform);
      }));
      const countryPaths = g.selectAll('.country')
         .data(features);
      const countryPathsEnter = countryPaths
         .enter().append('path')
            .attr('class', 'country');
      countryPaths
         .merge(countryPathsEnter)
            .attr('d', pathGenerator)
            .attr('fill', d => colorScale(colorValue(d)))
            .on('click', (d) => changeCountry(d))
      countryPathsEnter.append('title')   
         .text(d => {
            switch (document.querySelector('.table-header').textContent) {
               case "Global cases": {
                  return d.properties.country + ': ' + d.properties.cases/1000 + ' тыс.';
               }
               case "Global deaths": {
                  return d.properties.country + ': ' + d.properties.deaths/1000 + ' тыс.';
               }
               case "Global recovered": {
                  return d.properties.country + ': ' + d.properties.recovered/1000 + ' тыс.';
               }
               case "Last day cases": {
                  return d.properties.country + ': ' + d.properties.todayCases ;
               }
               case "Last day deaths": {
                  return d.properties.country + ': ' + d.properties.todayDeaths ;
               }
               case "Last day recovered": {
                  return d.properties.country + ': ' + d.properties.todayRecovered ;
               }
               case "Global cases per 100000": {
                  return d.properties.country + ': ' + (d.properties.casesPerOneMillion / 10).toFixed(2) ;
               }
               case "Global deaths per 100000": {
                  return d.properties.country + ': ' + (d.properties.deathsPerOneMillion / 10).toFixed(2) ;
               }
               case "Global recovered per 100000": {
                  return d.properties.country + ': ' + (d.properties.recoveredPerOneMillion / 10).toFixed(2) ;
               }
               case "Last day cases per 100000": {
                  return d.properties.country + ': ' + (d.properties.todayCases / d.properties.population  * 100000).toFixed(2) ;
               }
               case "Last day deaths per 100000": {
                  return d.properties.country + ': ' + (d.properties.todayDeaths / d.properties.population  * 100000).toFixed(2) ;
               }
               case "Last day recovered per 100000": {
                  return d.properties.country + ': ' + (d.properties.todayRecovered / d.properties.population  * 100000).toFixed(2) ;
               }
            }
         })
   }

   getMap () {
      const svg = d3.select('svg');
      const choroplethMapG = svg.append('g');
      const colorLegendG = svg.append('g')
         .attr('transform', `translate(40,330)`);
      const colorScale = d3.scaleOrdinal();
      const colorValue = d => {
         let option
            switch (this.parameter) {
            case "Global cases": {
               option = d.properties.cases;
               switch (true) {
                  case (option < 1000): {
                     return '5. 0 - 1000';
                  }
                  case (option >= 1000 && option < 100000): {
                     return '4. 1 тыс- 100 тыс';
                  }
                  case (option >= 100000 && option < 1000000): {
                     return '3. 100 тыс - 1млн';
                  }
                  case (option >= 1000000 && option < 5000000): {
                     return '2. 1 млн - 5 млн';
                  }
                  case (option >= 5000000 ): {
                     return '1. 5 млн и более';
                  }
                  default: {
                     return '5. 0 - 1000';
                  }          
               }
            }
            case "Global deaths": {
               option = d.properties.deaths;
               switch (true) {
                  case (option < 1000): {
                     return '5. 0 - 1000';
                  }
                  case (option >= 1000 && option < 10000): {
                     return '4. 1 тыс- 10 тыс';
                  }
                  case (option >= 10000 && option < 50000): {
                     return '3. 10 тыс - 50 тыс';
                  }
                  case (option >= 50000 && option < 150000): {
                     return '2. 50 тыс-100 тыс';
                  }
                  case (option >= 150000 ): {
                     return '1. 150 тыс и более';
                  }
                  default: {
                     return '5. 0 - 1000';
                  }          
               }
            }
            case  "Global recovered": {
               option = d.properties.recovered;
               switch (true) {
                  case (option < 1000): {
                     return '5. 0 - 1000';
                  }
                  case (option >= 1000 && option < 100000): {
                     return '4. 1 тыс- 100 тыс';
                  }
                  case (option >= 100000 && option < 1000000): {
                     return '3. 100 тыс - 1млн';
                  }
                  case (option >= 1000000 && option < 5000000): {
                     return '2. 1 млн - 5 млн';
                  }
                  case (option >= 5000000 ): {
                     return '1. 5 млн и более';
                  }
                  default: {
                     return '5. 0 - 1000';
                  }          
               }
            }
            case "Last day cases": {
               option = d.properties.todayCases;
               switch (true) {
                  case (option < 20): {
                     return '5. 0 - 20';
                  }
                  case (option >= 20 && option < 100): {
                     return '4. 20-100';
                  }
                  case (option >= 100 && option < 1000): {
                     return '3. 100 - 1000';
                  }
                  case (option >= 1000 && option < 5000): {
                     return '2. 1000 - 5000';
                  }
                  case (option >= 5000 ): {
                     return '1. 5000 тыс и более';
                  }
                  default: {
                     return '5. 0 - 20';
                  }             
               }
            }
            case "Last day deaths": {
               option = d.properties.todayDeaths;
               switch (true) {
                  case (option < 10): {
                     return '5. 0 - 10';
                  }
                  case (option >= 10 && option < 50): {
                     return '4. 10 - 50';
                  }
                  case (option >= 50 && option < 100): {
                     return '3. 50 - 100';
                  }
                  case (option >= 100 && option < 1000): {
                     return '2. 100 - 1000';
                  }
                  case (option >= 1000 ): {
                     return '1. 1000 и более';
                  }
                  default: {
                     return '5. 0 - 10';
                  }          
               }
            }
            case "Last day recovered": {
               option = d.properties.todayRecovered;
               switch (true) {
                  case (option < 50): {
                     return '5. 0 - 50';
                  }
                  case (option >= 50 && option < 100): {
                     return '4. 50 - 100';
                  }
                  case (option >= 100 && option < 1000): {
                     return '3. 100 - 1000';
                  }
                  case (option >= 1000 && option < 10000): {
                     return '2. 1000 - 10000';
                  }
                  case (option >= 10000 ): {
                     return '1. 10000 и более';
                  }
                  default: {
                     return '5. 0 - 50';
                  }             
               }
               
            }
            case "Global cases per 100000": {
               option = d.properties.casesPerOneMillion / 10;
               switch (true) {
                  case (option < 50): {
                     return '5. 0 - 50';
                  }
                  case (option >= 50 && option < 100): {
                     return '4. 50 - 100';
                  }
                  case (option >= 100 && option < 1000): {
                     return '3. 100 - 1000';
                  }
                  case (option >= 1000 && option < 5000): {
                     return '2. 1000 - 5000';
                  }
                  case (option >= 5000 ): {
                     return '1. 5000 и более';
                  }
                  default: {
                     return '5. 0 - 50';
                  }             
               }
            }
            case "Global deaths per 100000": {
               option = d.properties.deathsPerOneMillion / 10;
               switch (true) {
                  case (option < 5): {
                     return '5. 0 - 5';
                  }
                  case (option >= 5 && option < 10): {
                     return '4. 5 - 10';
                  }
                  case (option >= 10 && option < 50): {
                     return '3. 10 - 50';
                  }
                  case (option >= 50 && option < 100): {
                     return '2. 50 - 100 ';
                  }
                  case (option >= 100 ): {
                     return '1. 100 н и более';
                  }
                  default: {
                     return '5. 0 - 5';
                  }          
               }
            }
            case "Global recovered per 100000": {
               option = d.properties.recoveredPerOneMillion / 10;
               switch (true) {
                  case (option < 50): {
                     
                  }
                  case (option >= 50 && option < 100): {
                     return '4. 50 - 100';
                  }
                  case (option >= 100 && option < 1000): {
                     return '3. 100 - 1000';
                  }
                  case (option >= 1000 && option < 5000): {
                     return '2. 1000 - 5000';
                  }
                  case (option >= 5000 ): {
                     return '1. 5000 и более';
                  }
                  default: {
                     return '5. 0 - 50';
                  }             
               }
               
            }
            case "Last day cases per 100000": {
               option = d.properties.todayCases / d.properties.population  * 100000;
               switch (true) {
                  case (option < 0.1): {
                     return '5. 0 - 0.1';
                  }
                  case (option >= 0.1 && option < 0.5): {
                     return '4. 0.1 - 0.5';
                  }
                  case (option >= 0.5 && option < 1): {
                     return '3. 0.5 - 1';
                  }
                  case (option >= 1 && option < 10): {
                     return '2. 1 - 10 ';
                  }
                  case (option >= 10 ): {
                     return '1. 10 н и более';
                  }
                  default: {
                     return '5. 0 - 0.1';
                  }          
               }
            }
            case "Last day deaths per 100000": {
               option = d.properties.todayDeaths / d.properties.population  * 100000;
               switch (true) {
                  case (option < 0.05): {
                     return '3. 0 - 0.05';
                  }
                  case (option >= 0.05 && option < 0.1): {
                     return '2. 0.05 - 0.1';
                  }
                  case (option >= 0.1): {
                     return '1. 0.1 and more';
                  }
                  default: {
                     return '3. 0 - 0.05';
                  }          
               }
            }
            case  "Last day recovered per 100000": {

               option = d.properties.todayRecovered / d.properties.population * 1000000;
               switch (true) {
                  case (option < 0.1): {
                     return '5. 0 - 0.1';
                  }
                  case (option >= 0.1 && option < 0.5): {
                     return '4. 0.1 - 0.5';
                  }
                  case (option >= 0.5 && option < 1): {
                     return '3. 0.5 - 1';
                  }
                  case (option >= 1 && option < 10): {
                     return '2. 1 - 10';
                  }
                  case (option >= 10 ): {
                     return '1. 10 и более';
                  }
                  default: {
                     return '5. 0 - 0.1';
                  }             
               }
            }
         }
      }
      
      let selectedColorValue;
      let features;
      
      const onClick = d => {
         selectedColorValue = d;
         render()
      };

      const changeCountry = (d) => {
         if (d3.event.target.childNodes[0] === undefined) return
         this.chooseCountry(d.properties.country);
         this.showChart(this.parameter, d.properties.country)
         this.setCity(d.properties.country)
      };


      this.loadAndProcessData().then(countries => { 
            countries.features.forEach(d => {
               let isCountryCovid = false;
               this.allCountries.forEach((item) => {
            
                  if (+d.properties.iso_n3 === item.countryInfo._id) {
                     isCountryCovid = true;
                     Object.assign(d.properties, item);
                  }                  
               })
               if (!isCountryCovid) {
                  Object.assign(d.properties, {
                     active: 0,
                     activePerOneMillion: 0,
                     cases: 0,
                     casesPerOneMillion: 0,
                     critical: 0,
                     criticalPerOneMillion: 0,
                     deaths: 0,
                     deathsPerOneMillion: 0,
                     oneCasePerPeople: 0,
                     oneDeathPerPeople: 0,
                     oneTestPerPeople: 0,
                     population: 1,
                     recovered: 0,
                     recoveredPerOneMillion: 0,
                     tests: 0,
                     testsPerOneMillion: 0,
                     todayCases: 0,
                     todayDeaths: 0,
                     todayRecovered: 0,
                     updated: 0,
                  });
               }
            });
            features = countries.features;
            render();
      

      });

      const render = () => {
         colorScale
            .domain(features.map(colorValue))
            .domain(colorScale.domain().sort().reverse())
            .range(d3.schemeReds[colorScale.domain().length]);
      
         colorLegendG.call(this.colorLegend, {
            colorScale,
            circleRadius: 8,
            spacing: 20,
            textOffset: 12,
            backgroundRectWidth: 235,
            onClick,
            selectedColorValue
         });
         choroplethMapG.call(this.choroplethMap, {
            features,
            colorScale,
            colorValue,
            changeCountry,
            selectedColorValue
         })
      };
   }
}