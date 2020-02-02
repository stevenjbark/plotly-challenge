

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


//EVENT HANDLER FOR DROPDOWN MENU UPDATE PLOTLY EVENT
d3.select("#selDataset").on("change", updatePlotly);


//UPDATE PLOTLY FUNCTION
//Create function to take samples array, use data from dropdown menu, filter data to arrays,
//then use arrays for plotting bar graphs for each sample.
function updatePlotly() {


//EXTRACT JSON FILE AND EXTRACT SAMPLES ARRAY
d3.json("samples.json").then(function(data) {
    
    //Isolate the samples array from the samples.json file
    var samples = data.samples;
    //console.log(samples);



    //DROPDOWN MENU SECTION
    //Select the #selDataset again to now use with all of the sampleNumbers available.
    var sampleMenu = d3.select("#selDataset");

    //Assign the value of the dropdown menu option to sampleID variable for data filtering.
    var sampleID = sampleMenu.property("value");
    console.log(sampleID);

   
    
    //DATA FILTERING SECTION
    //sampleID value from sampleMenu filtering data by sample ID number.
    var newSample = samples.filter(value => value.id === sampleID);
    //console.log(newSample);
    
    //Extract otu_ids and sample_values arrays, sliced for the top 10 in each.
    var otu_id = newSample.map(value => value.otu_ids.slice(0,10));
    //The otu_ids are stings that javascript tries to use as numbers. STUPID! Have to modify
    //so javascript can't screw these up!
    var ids = []
    otu_id[0].map(function(id) {
        p = "OTU" + id;
        ids.push(p);
    });
    console.log(ids);
    
    //Quantitation of bacteria in samples, top 10
    var sample_value = newSample.map(value => value.sample_values.slice(0,10));
    var quantity = sample_value[0];
    console.log(quantity);

    //OTU labels for bacteria in samples, top 10, extracted out species name
    var otu_label = newSample.map(value => value.otu_labels.slice(0,10));
    var bacteriaFullName = otu_label[0];
   
    bacteriaSpecies = []
    bacteriaFullName.map(function(longName) {
        array = longName.split(";");
        q = array.slice(array.length-1, array.length);
        bacteriaSpecies.push(q[0])
    })
    console.log(bacteriaSpecies);
    console.log(bacteriaFullName);
    
    
    
    //PLOTTING BAR CHART IN PLOTLY
    //Create trace
    var trace = {
        x: ids,
        y: quantity,
        type: "bar",
        text: bacteriaSpecies
    };

    //Create data array for the plot
    var data = [trace]

    //Define plot layout
    var layout = {
        title: `Quantitation of Bacterial Species in Sample ${sampleID}`,
        xaxis: {title: "ID"},
        yaxis: {title: "Sample Quantitation"}
    };

    //Plot chart using the #bar ID
    Plotly.newPlot("bar", data, layout);


    //PLOTTING BUBBLE CHART IN PLOTLY



    

});

};
