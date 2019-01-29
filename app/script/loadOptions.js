let selectValuesForPresentation = function () {
    //let data = DataProvider.getPreparedData();
    let data;
    DataProvider.getDataForCountrySelection(function(value){data = value;});
    let selectedRegion1 = 0;
    let selectedCountry1 = 'Bermuda';
    let selectedDataSet1 = '22013';
    let DataForTimeline1;
    DataProvider.getDataForTimeline(selectedCountry1, selectedDataSet1,function(value){DataForTimeline1 = value;});
    let selectedRegion2 = 0;
    let selectedCountry2 = 'Bermuda';
    let selectedDataSet2 = '22013';
    let DataForTimeline2;
    DataProvider.getDataForTimeline(selectedCountry2, selectedDataSet2,function(value){DataForTimeline2 = value;});

    let region1Vue = new Vue({
        el: '#dropdownRegion1',
        data: {
            selectedRegion: data[0].Index,
            options: data,
        },
        methods: {
            onChange: function () {
                country1Vue.setCountryData(this.selectedRegion);
                selectedRegion1 = this.selectedRegion;
            }
        },
    });

    let country1Vue = new Vue({
        el: '#dropdownCountry1',
        data: {
            selectedCountry: data[0].Countries[0].Area,
            options: data[0].Countries,
        },
        methods: {
            setCountryData: function (thisValue) {
                this.options = [];
                this.options = data[thisValue].Countries;
                this.selectedCountry = data[thisValue].Countries[0].Area;
                selectedCountry1 = this.selectedCountry;
                loadDataForTimeLine1();
            },
            onChange: function () {
                selectedCountry1 = this.selectedCountry;
                loadDataForTimeLine1();
            }
        }
    });

    let dataSet1Vue = new Vue({
        el: '#dropdownDataSet1',
        data: {
            selectedDataSet: '22013',
            options: [
                {'Text': 'Gross Domestic Product per Capita', 'value': '22013'},
                {'Text': 'Average Protein Supply (G/CAP/DAY)(3-Year Average)', 'value': '21013'},
                {'Text': 'Prevalence of Obesity in the Adult Pop (18 & over)', 'value': '21042'},
                {'Text': 'Prevalence of Undernourishment (Percent)', 'value': '210041'},
            ]
        },
        methods: {
            onChange: function () {
                selectedDataSet1 = this.selectedDataSet;
                loadDataForTimeLine1();
            }
        }
    });

    let region2Vue = new Vue({
        el: '#dropdownRegion2',
        data: {
            selectedRegion: data[0].Index,
            options: data,
        },
        methods: {
            onChange: function () {
                country2Vue.setCountryData(this.selectedRegion);
                selectedRegion2 = this.selectedRegion;
            }
        },
    });

    let country2Vue = new Vue({
        el: '#dropdownCountry2',
        data: {
            selectedCountry: data[0].Countries[0].Area,
            options: data[0].Countries,
        },
        methods: {
            setCountryData: function (thisValue) {
                this.options = [];
                this.options = data[thisValue].Countries;
                this.selectedCountry = data[thisValue].Countries[0].Area;
                selectedCountry2 = this.selectedCountry;
                loadDataForTimeLine2();
            },
            onChange: function () {
                selectedCountry2 = this.selectedCountry;
                loadDataForTimeLine2();
            }
        }
    });

    let dataSet2Vue = new Vue({
        el: '#dropdownDataSet2',
        data: {
            selectedDataSet: '22013',
            options: [
                {'Text': 'Gross Domestic Product per Capita', 'value': '22013'},
                {'Text': 'Average Protein Supply (G/CAP/DAY)(3-Year Average)', 'value': '21013'},
                {'Text': 'Prevalence of Obesity in the Adult Pop (18 & over)', 'value': '21042'},
                {'Text': 'Prevalence of Undernourishment (Percent)', 'value': '210041'},
            ]
        },
        methods: {
            onChange: function () {
                selectedDataSet2 = this.selectedDataSet;
                loadDataForTimeLine2();
            }
        }
    });

    let loadDataForTimeLine1 = function () {
        DataProvider.getDataForTimeline(selectedCountry1, selectedDataSet1,function(value){DataForTimeline1 = value;});
        //Visualization.draw(DataForTimeline1);
        //Helper.getPearsonCoeffizient(DataForTimeline1,DataForTimeline2,Helper.echoValue);
        //Helper.getSpearmanCoeffizient(DataForTimeline1, DataForTimeline2,Helper.echoValue);
        //DataProvider.getDataForCountryAndYear(selectedCountry1,2000,Helper.echoValue);
        console.log("Country: "+selectedCountry1);
        DataProvider.getDataForCountryAndYear(selectedCountry1,2000,Helper.echoValue);
        Helper.getCoeffizientsForRegion(selectedCountry1,Helper.echoValue);
    };

    let loadDataForTimeLine2 = function () {
        DataProvider.getDataForTimeline(selectedCountry2, selectedDataSet2, function(value){DataForTimeline2 = value;});
    };
};

