

//DROPDOWN MENU POPULATING WITH SAMPLE ID NUMBERS FROM DATA
//Extract samples data from json file.
d3.json("samples.json").then(function(data) {
    
    //Isolate the samples array from the samples.json file
    var samples = data.samples;
    //console.log(samples);

    //Extract the ID numbers and use these to create a listing for the dropdown menu.
    var sampleNumbers = samples.map(value => value.id);
    //console.log(sampleNumbers);

    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    //Loop through sampleNumbers for appending to dropdownMenu
    sampleNumbers.forEach(function(newSample) {

        //For each new sampleNumber, append a new row and text.
        var cell = dropdownMenu.append("option");
        cell.text(newSample);

        });
    });


//When change on DOM, invoke updatePlotly
d3.select("#selDataset").on("change", updatePlotly);




function updatePlotly() {


//EXTRACT JSON FILE AND EXTRACT SAMPLES ARRAY
d3.json("samples.json").then(function(data) {
    
    //Isolate the samples array from the samples.json file
    var samples = data.samples;
    //console.log(samples);



    //DROPDOWN MENU SECTION
    //Select the #selDataset again to now use with all of the sampleNumbers available.
    var sampleMenu = d3.select("#selDataset");

    //Assign the value of the dropdown menu option to a variable. Use sampleID for subsequent filtering in the next steps.
    var sampleID = sampleMenu.property("value");
    console.log(sampleID);

   
    
    //DATA FILTERING SECTION
    //sampleID from sampleMenu should provide filtering value for comparing sample ID number.
    var newSample = samples.filter(value => value.id === sampleID);
    //console.log(newSample);
    
    //Extract otu_ids and sample_values arrays, sliced for the top 10 in each.
    var otu_id = newSample.map(value => value.otu_ids.slice(0,10));
    console.log(otu_id);
    
    var sample_value = newSample.map(value => value.sample_values.slice(0,10));
    console.log(sample_value);
    
    
    

    //Create trace
    var trace = {
        x: otu_id,
        y: sample_value,
        type: "bar"
    };

    //Create data array for the plot
    var data = [trace]

    //Define plot layout
    var layout = {
        title: "Quantitation of Bacterial Species",
        xaxis: {title: "ID"},
        yaxis: {title: "Sample Quantitation"}
    };

    //Plot chart using the #bar ID
    Plotly.newPlot("bar", data, layout);



});

};
