var bipMinMax,politMinMax,fatMinMax;
var svgId;
var data;
var animationTimeout;
var svgContainerId;

function initUI(_data, _svgId, _svgContainerId)
{
    data = _data;
    svgId = _svgId;
    svgContainerId = _svgContainerId;
    
    politMinMax = getMinMax(data, "polit");
    bipMinMax = getMinMax(data, "bip");
    fatMinMax = getMinMax(data, "fat");

    initDiagram();
}

function onClickDatapoint(d){
    $("#countryList").val(d.country);
    onListSelectionChanges();
}

function updateList(data, listId) {
    var list = $("#" + listId);

    getCountryList(data).map(x =>
        $('<option>').text(x)
            .appendTo(list)
    )

}

function onListSelectionChanges() {
    unhighlightCountries(svgId);
    let id = $("#countryList").val();
    highlightCountry(svgId, id);

    updateLabels();
}

function updateLabels() {

    let year = $('#year').val();
    let id = $("#countryList").val();
    
    let countryData = getCountryByTime(data, year, id);

    if (countryData == undefined)
        countryData = {
            bip: "?",
            fat: "?",
            polit: "?"
        }

    $('#countryId').text(id);
    $('#bipId').text(countryData.bip + "$");
    $('#fatId').text(countryData.fat + "%");
    drawPolitCircle(countryData.polit, 'politId')
}

// If user changes the year -or- clicks the play button
// the following function triggers the Diagram update
function update() {
    var year = $('#year').val()
    updateDiagram(data[String(year)], svgId,year);
    updateLabels();
}

// If the user clicks on the play button
// animationLoop starts and continous the animation
// by updating the slider and calling the update function
function animationLoop() {
    var slider = $('#year')
    var year = Number(slider.val());
    if (year == 2016)
        return;

    slider.val(year + 1);

    update();
    clearTimeout(animationTimeout)
    animationTimeout = setTimeout(animationLoop, 1200);
}

function initDiagram(){

    var container = $('#' + svgContainerId);
    
    setWidth(container.width());
    setHeight(container.height());

    setPolitDomain(politMinMax[0], politMinMax[1]);
    setBipDomain(bipMinMax[0], bipMinMax[1]);
    setFatDomain(fatMinMax[0], fatMinMax[1]);

    // Initialize Diagram with Year 2000
    generateDiagram(data["2000"], svgId,onClickDatapoint);

    // Update List of countries
    updateList(data, "countryList");

    // Select Year 2000
    $('#year').val(2000);

    // Select Germany
    $("#countryList").val("Germany");
    
    highlightCountry(svgId,"Germany")

    updateLabels();
}