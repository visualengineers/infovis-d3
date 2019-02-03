/**
 * Helper module
 */
var Helper = function () {

    return {
        multiply: function(a, b) {
            return a * b;
        },
        getPearsonCoeffizient: function(timeline1, timeline2, callback) {
            let sumCounter = 0;
            let sumDenominator1 = 0;
            let sumDenominator2 = 0;
            let pearson;

            maxIndex1 = timeline1.actualData.length;
            for (var i=0; i<maxIndex1; i++){
                timeline2.actualData.forEach(function (item) {
                    if (timeline1.actualData[i].year === item.year) {
                        sumCounter += (parseFloat(timeline1.actualData[i].value)-timeline1.avgValue)*(parseFloat(item.value)-timeline2.avgValue);
                        sumDenominator1 += (parseFloat(timeline1.actualData[i].value)-timeline1.avgValue)*(parseFloat(timeline1.actualData[i].value)-timeline1.avgValue);
                        sumDenominator2 += (parseFloat(item.value)-timeline2.avgValue) * (parseFloat(item.value)-timeline2.avgValue);
                    }
                });
            }

            pearson = sumCounter / (Math.sqrt(sumDenominator1)*Math.sqrt(sumDenominator2));
            if (isNaN(pearson)){pearson = '0.00';}
            else {pearson = (Math.round(pearson * 100) / 100);}
            callback(pearson);
        },
        getSpearmanCoeffizient: function (timeline1,timeline2,callback) {
            timeline1.spearman = JSON.parse(JSON.stringify(timeline1.actualData));
            timeline2.spearman = JSON.parse(JSON.stringify(timeline2.actualData));

            let maxIndex1 = timeline1.spearman.length;
            let maxIndex2 = timeline2.spearman.length;
            let index1 = 0;
            let index2 = 0;
            let kleiner1 = 0;
            let kleiner2 = 0;
            let gleich1 = 0;
            let gleich2 = 0;
            let sumCounter = 0;
            let sumDenominator1 = 0;
            let sumDenominator2 = 0;
            let spearman;

            //Werte, die keinen Partner haben, rauswerfen
            while ((index1<maxIndex1) && (index2 < maxIndex2)) {
                if (timeline1.spearman[index1].year < timeline2.spearman[index2].year) {
                timeline1.spearman.splice(index1,1);
                maxIndex1--;
                } else if (timeline1.spearman[index1].year > timeline2.spearman[index2].year) {
                    timeline2.spearman.splice(index2,1);
                    maxIndex2--;
                } else {
                    index1++;
                    index2++;
                }
            }

            if ((index1 === maxIndex1) && (index2 < maxIndex2)) {
                timeline2.spearman.splice(index2,(maxIndex2-index2));
            } else if ((index1 < maxIndex1) && (index2 === maxIndex2)) {
                timeline1.spearman.splice(index1,(maxIndex1-index1));
            }

            //Rangbestimmung
            maxIndex1 = timeline1.spearman.length;
            for (index1=0; index1<maxIndex1;index1++) {
                gleich1=0;
                gleich2=0;
                kleiner1=0;
                kleiner2=0;
                for (index2=0;index2<maxIndex1;index2++){
                    if (parseFloat(timeline1.spearman[index1].value)>parseFloat(timeline1.spearman[index2].value)){kleiner1++;}
                    else if (timeline1.spearman[index1].value===timeline1.spearman[index2].value){gleich1++;}

                    if (parseFloat(timeline2.spearman[index1].value)>parseFloat(timeline2.spearman[index2].value)){kleiner2++;}
                    else if (timeline2.spearman[index1].value===timeline2.spearman[index2].value){gleich2++;}
                }
                timeline1.spearman[index1].rang = kleiner1 + 0.5 + 0.5*gleich1;
                timeline2.spearman[index1].rang = kleiner2 + 0.5 + 0.5*gleich2;
            }
            //Spearman-Wert berechnen
            let avgValue=(maxIndex1+1)/2;
            for (var i=0; i<maxIndex1; i++){
                timeline2.spearman.forEach(function (item) {
                    if (timeline1.spearman[i].year === item.year) {
                        sumCounter += (timeline1.spearman[i].rang-avgValue)*(item.rang-avgValue);
                        sumDenominator1 += (timeline1.spearman[i].rang-avgValue)*(timeline1.spearman[i].rang-avgValue);
                        sumDenominator2 += (item.rang-avgValue)*(item.rang-avgValue);
                    }
                });
            }
            spearman = sumCounter / (Math.sqrt(sumDenominator1)*Math.sqrt(sumDenominator2));
            if (isNaN(spearman)){spearman = '0.00';}
            else {spearman = (Math.round(spearman * 100) / 100);}
            callback(spearman);
        },
        echoValue : function (value) {
            console.log("helper.echoValue:");
            console.log(value);
        },
        getCoeffizientsForRegion(country,callback){
            let DatasetForGrossDomesticProductPerCapita;
            let DatasetForAverageProteinSupply;
            let DatasetForPrevalenceOfObesityInTheAdultPop;
            let DatasetForPrevalenceOfUndernourishment;

            DataProvider.getDataForTimeline(country, '22013', function(value){DatasetForGrossDomesticProductPerCapita = value;});
            DataProvider.getDataForTimeline(country, '21013', function(value){DatasetForAverageProteinSupply = value;});
            DataProvider.getDataForTimeline(country, '21042', function(value){DatasetForPrevalenceOfObesityInTheAdultPop = value;});
            DataProvider.getDataForTimeline(country, '210041', function(value){DatasetForPrevalenceOfUndernourishment = value;});

            let GDP_Protein_Pearson;
            let GDP_Protein_Spearman;
            let GDP_Obesity_Pearson;
            let GDP_Obesity_Spearman;
            let GDP_Undernourishment_Pearson;
            let GDP_Undernourishment_Spearman;
            let Protein_Obesity_Pearson;
            let Protein_Obesity_Spearman;
            let Protein_Undernourishment_Pearson;
            let Protein_Undernourishment_Spearman;
            let Obesity_Undernourishment_Pearson;
            let Obesity_Undernourishment_Spearman;

            Helper.getPearsonCoeffizient(DatasetForGrossDomesticProductPerCapita,DatasetForAverageProteinSupply,function(value){GDP_Protein_Pearson = value;})
            Helper.getPearsonCoeffizient(DatasetForGrossDomesticProductPerCapita,DatasetForPrevalenceOfObesityInTheAdultPop,function(value){GDP_Obesity_Pearson = value;})
            Helper.getPearsonCoeffizient(DatasetForGrossDomesticProductPerCapita,DatasetForPrevalenceOfUndernourishment,function(value){GDP_Undernourishment_Pearson = value;})
            Helper.getPearsonCoeffizient(DatasetForAverageProteinSupply,DatasetForPrevalenceOfObesityInTheAdultPop,function(value){Protein_Obesity_Pearson = value;})
            Helper.getPearsonCoeffizient(DatasetForAverageProteinSupply,DatasetForPrevalenceOfUndernourishment,function(value){Protein_Undernourishment_Pearson = value;})
            Helper.getPearsonCoeffizient(DatasetForPrevalenceOfObesityInTheAdultPop,DatasetForPrevalenceOfUndernourishment,function(value){Obesity_Undernourishment_Pearson = value;})

            Helper.getSpearmanCoeffizient(DatasetForGrossDomesticProductPerCapita,DatasetForAverageProteinSupply,function(value){GDP_Protein_Spearman = value;})
            Helper.getSpearmanCoeffizient(DatasetForGrossDomesticProductPerCapita,DatasetForPrevalenceOfObesityInTheAdultPop,function(value){GDP_Obesity_Spearman = value;})
            Helper.getSpearmanCoeffizient(DatasetForGrossDomesticProductPerCapita,DatasetForPrevalenceOfUndernourishment,function(value){GDP_Undernourishment_Spearman = value;})
            Helper.getSpearmanCoeffizient(DatasetForAverageProteinSupply,DatasetForPrevalenceOfObesityInTheAdultPop,function(value){Protein_Obesity_Spearman = value;})
            Helper.getSpearmanCoeffizient(DatasetForAverageProteinSupply,DatasetForPrevalenceOfUndernourishment,function(value){Protein_Undernourishment_Spearman = value;})
            Helper.getSpearmanCoeffizient(DatasetForPrevalenceOfObesityInTheAdultPop,DatasetForPrevalenceOfUndernourishment,function(value){Obesity_Undernourishment_Spearman = value;})

            let result = {
                GDP_Protein_Pearson: GDP_Protein_Pearson,
                GDP_Protein_Spearman: GDP_Protein_Spearman,
                GDP_Obesity_Pearson: GDP_Obesity_Pearson,
                GDP_Obesity_Spearman: GDP_Obesity_Spearman,
                GDP_Undernourishment_Pearson: GDP_Undernourishment_Pearson,
                GDP_Undernourishment_Spearman: GDP_Undernourishment_Spearman,
                Protein_Obesity_Pearson: Protein_Obesity_Pearson,
                Protein_Obesity_Spearman: Protein_Obesity_Spearman,
                Protein_Undernourishment_Pearson: Protein_Undernourishment_Pearson,
                Protein_Undernourishment_Spearman: Protein_Undernourishment_Spearman,
                Obesity_Undernourishment_Pearson: Obesity_Undernourishment_Pearson,
                Obesity_Undernourishment_Spearman: Obesity_Undernourishment_Spearman
            };
            callback(result);
        },
        get1DatasetFrom2Timelines: function (timeline1,timeline2,callback) {
            let result = [];
            let year;

            for (i=0;i<18;i++) {
                year = 2000+i;
                result[i] = {
                    year: year,
                    value1: "0",
                    value2: "0"
                }
            }

            for (i=0;i<timeline1.actualData.length;i++){
                j=(timeline1.actualData[i].year)-2000;
                result[j].value1=timeline1.actualData[i].value;
            }

            for (i=0;i<timeline2.actualData.length;i++){
                j=(timeline2.actualData[i].year)-2000;
                result[j].value2=timeline2.actualData[i].value;
            }

            callback(result);
        }
    }
}();
