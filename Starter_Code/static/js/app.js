

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
    });

    console.log(bacteriaSpecies);
    console.log(bacteriaFullName);
    
    

    //INTEGRATE RETRIEVING DEMOGRAPHIC INFORMATION WITH UPDATEPLOTLY FUNCTION ON SAMPLEID
    //Extract metadata array from json file
    d3.json("samples.json").then(function(demogData) {
        var metadata = demogData.metadata;
        //console.log(metadata);

        //Filter metadata based on sampleID to obtain demographic data for sample
        var demographicData = metadata.filter(data => data.id == sampleID);

        //Extract age, bbtype, ethnicity, gender, location, wfreq data
        var age = demographicData[0].age;
        var ethnicity = demographicData[0].ethnicity;
        var gender = demographicData[0].gender;
        var location = demographicData[0].location;
        var wfreq = demographicData[0].wfreq;

        
        //Clear previous data in demographicMenu: Select in Line 1, Reassign to nothing in Line2
        var oldDemographicMenu = d3.select("#sample-metadata");
        oldDemographicMenu.html("");
        
        
        //Select sample-metadata id using d3. This is where I will insert text for demographicData
        var demographicMenu = d3.select("#sample-metadata");

            var cell = demographicMenu.append("p");
            cell.text(`Age: ${age}`);
                
            var cell = demographicMenu.append("p");
            cell.text(`Ethnicity: ${ethnicity}`);

            var cell = demographicMenu.append("p");
            cell.text(`Gender: ${gender}`);
                
            var cell = demographicMenu.append("p");
            cell.text(`Location: ${location}`);

            var cell = demographicMenu.append("p");
            cell.text(`Wash Frequency: ${wfreq}`);
                
        });
    
    
    console.log(ids);
    //PLOTTING BAR CHART IN PLOTLY
    //Create trace
    var trace = {
        x: ids,
        y: quantity,
        type: "bar",
        marker: {
            color: [
            '#1f77b4',  // muted blue
            '#ff7f0e',  // safety orange
            '#2ca02c',  // cooked asparagus green
            '#d62728',  // brick red
            '#9467bd',  // muted purple
            '#8c564b',  // chestnut brown
            '#e377c2',  // raspberry yogurt pink
            '#7f7f7f',  // middle gray
            '#bcbd22',  // curry yellow-green
            ]},
        text: bacteriaSpecies
    };

    //Create data array for the plot
    var data = [trace]

    //Define plot layout
    var layout = {
        height: 600,
        width: 900,
        title: `Quantitation of Bacterial Species in Sample ${sampleID}`,
        xaxis: {title: "ID"},
        yaxis: {title: "Bacterial Amount"}
    };

    //Plot chart using the "bar" ID
    Plotly.newPlot("bar", data, layout);


    //PLOTTING BUBBLE CHART IN PLOTLY
    //Create trace
    var trace2 = {
        x: ids,
        y: quantity,
        mode: "markers",
        marker: {
            size: quantity,
            color: [
            '#1f77b4',  // muted blue
            '#ff7f0e',  // safety orange
            '#2ca02c',  // cooked asparagus green
            '#d62728',  // brick red
            '#9467bd',  // muted purple
            '#8c564b',  // chestnut brown
            '#e377c2',  // raspberry yogurt pink
            '#7f7f7f',  // middle gray
            '#bcbd22',  // curry yellow-green
            ]
            },
        text: bacteriaSpecies
    };

    //Create data array
    var data2 = [trace2];

    //Create layout
    var layout2 = {
        title: `Quantitation of Bacterial Species in Sample ${sampleID}`,
        xaxis: {title: "ID"},
        yaxis: {title: "Bacterial Amount"},

    };

    //Plot bubble chart using "bubble" id
    Plotly.newPlot("bubble", data2, layout2)

    });
};

