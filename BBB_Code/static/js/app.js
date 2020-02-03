

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

    //Initial menu option should be "ID Number"
    var cell = dropdownMenu.append("option");
    cell.text("ID Number");

    //Loop through sampleNumbers for appending to dropdownMenu below "ID Number"
    sampleNumbers.forEach(function(newSample) {

        //For each new sampleNumber, append a new row and text.
        var cell = dropdownMenu.append("option");
        cell.text(newSample);

        });
    });




//INITIAL FUNCTION TO LOAD FIRST GRAPHS FOR SAMPLE 940 ON STARTUP
function init() {

d3.json("samples.json").then(function(data) {

    //Use initial sample for 940 data, extract for plotting for intial page startup
    var initial_sample = data.samples[0];
    //console.log(initial_sample);
    
    //Extract and modify bubble_otu_ids for plotting
    var raw_bubble_otu_ids = initial_sample.otu_ids;
    var bubble_otu_ids = []
    raw_bubble_otu_ids.map(function(id){
        z = "OTU" + id;
        bubble_otu_ids.push(z);
    });
    //console.log(bubble_otu_ids);
    
    //Slice to generate bar_otu_ids for plotting
    var bar_otu_ids = bubble_otu_ids.slice(0,10);
    //console.log(bar_otu_ids);

    //Extract bubble_sample_values for plotting
    var bubble_sample_values = initial_sample.sample_values;
    //console.log(bubble_sample_values);

    //Slice to generate bar_sample_values
    var bar_sample_values = bubble_sample_values.slice(0,10);

    //Extract otu_labels for bubble plot
    var bubble_otu_labels = initial_sample.otu_labels;
    //console.log(bubble_otu_labels);

    //Extract the species names from the bubble_otu_labels
    bubble_bacSpecies = []
    bubble_otu_labels.map(function(longName) {
        array = longName.split(";");
        q = array.slice(array.length-1, array.length);
        bubble_bacSpecies.push(q[0])
    });
    //console.log(bubble_bacSpecies);

    //For sample 940, wash fequencey (wfreq) = 2, so hardcode.
    wfreq = 2

    //GAUGE PLOT IN PLOTLY
    var data = [
        {
            domain: {x: [0,1], y:[0,1]},
            value: wfreq,
            title: {text: "Wash Frequency"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9] },
                steps: [
                    { range: [0,2], color: "red"},
                    { range: [2,4], color: "yellow"},
                    { range: [4,9], color: "lightgreen"},
                ]
            }
        }
    ];

    var layout = {width: 400, height: 400, margin: {t: 0, b: 0 }};
    Plotly.newPlot("gauge", data, layout);
    
        //PLOTTING BAR CHART IN PLOTLY
    //Create trace
    var trace = {
        x: bar_otu_ids,
        y: bar_sample_values,
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
            '#17becf',  // blue-teal
            ]},
        text: bubble_bacSpecies
    };

    //Create data array for the plot
    var data = [trace]

    //Define plot layout
    var layout = {
        height: 400,
        width: 500,
        title: "Top 10 Bacterial Species in Sample 940",
        xaxis: {title: "ID"},
        yaxis: {title: "Bacterial Quantity"}
    };

    //Plot chart using the "bar" ID
    Plotly.newPlot("bar", data, layout);


    //PLOTTING BUBBLE CHART IN PLOTLY
    //Create trace
    var trace2 = {
        x: raw_bubble_otu_ids,
        y: bubble_sample_values,
        mode: "markers",
        marker: {
            size: bubble_sample_values,
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
            '#17becf',  // blue-teal
            ]
            },
        text: bubble_otu_labels
    };

    //Create data array
    var data2 = [trace2];

    //Create layout
    var layout2 = {
        title: "Quantitation of Bacterial Species in Sample 940",
        xaxis: {title: "ID"},
        yaxis: {title: "Bacterial Quantity"},

    };

    //Plot bubble chart using "bubble" id
    Plotly.newPlot("bubble", data2, layout2)

});

}



//EVENT HANDLER FOR DROPDOWN MENU UPDATE PLOTLY EVENT: INTERACTIVE PLOTS
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
    
    //Extract all otu_ids for analysis using bubble plot
    var otu_ids_all = newSample.map(value => value.otu_ids);

    //For bar plot, extract otu_ids and sample_values arrays, sliced for the top 10 in each.
    var otu_id = newSample.map(value => value.otu_ids.slice(0,10));
    //The otu_ids are stings that javascript tries to use as numbers. STUPID! Have to modify
    //so javascript can't screw these up!
    var ids = []
    otu_id[0].map(function(id) {
        p = "OTU" + id;
        ids.push(p);
    });
    //console.log(ids);
    
    //Quantitation of all bacterial data for bubble plot
    var sample_values_all = newSample.map(value => value.sample_values);
    //console.log(sample_values_all[0]);

    //Quantitation of bacteria in samples, top 10 for bar plot
    var sample_value = newSample.map(value => value.sample_values.slice(0,10));
    var quantity = sample_value[0];
    //console.log(quantity);

    //OTU labels for all bacterial species in sample for bubble plot.
    var otu_labels_all = newSample.map(value => value.otu_labels);

    //OTU labels for bacteria in samples, top 10, extracted out species name
    var otu_label = newSample.map(value => value.otu_labels.slice(0,10));
    var bacteriaFullName = otu_label[0];
   
    bacteriaSpecies = []
    bacteriaFullName.map(function(longName) {
        array = longName.split(";");
        q = array.slice(array.length-1, array.length);
        bacteriaSpecies.push(q[0])
    });

    //console.log(bacteriaSpecies);
    //console.log(bacteriaFullName);
    
    

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
    
        //Because wfreq exists only in this scope, I have to generate gauge plot here

        //GAUGE PLOT IN PLOTLY
        var data = [
            {
                domain: {x: [0,1], y:[0,1]},
                value: wfreq,
                title: {text: "Wash Frequency"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [null, 9] },
                    steps: [
                        { range: [0,2], color: "red"},
                        { range: [2,4], color: "yellow"},
                        { range: [4,9], color: "lightgreen"},
                    ]
                }
            }
        ];

        var layout = {width: 400, height: 400, margin: {t: 0, b: 0 }};
        Plotly.newPlot("gauge", data, layout);
    });


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
            '#17becf',  // blue-teal
            ]},
        text: bacteriaSpecies
    };

    //Create data array for the plot
    var data = [trace]

    //Define plot layout
    var layout = {
        height: 400,
        width: 500,
        title: `Top 10 Bacterial Species in Sample ${sampleID}`,
        xaxis: {title: "ID"},
        yaxis: {title: "Bacterial Quantity"}
    };

    //Plot chart using the "bar" ID
    Plotly.newPlot("bar", data, layout);


    //PLOTTING BUBBLE CHART IN PLOTLY
    //Create trace
    var trace2 = {
        x: otu_ids_all[0],
        y: sample_values_all[0],
        mode: "markers",
        marker: {
            size: sample_values_all[0],
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
            '#17becf',  // blue-teal
            ]
            },
        text: otu_labels_all[0]
    };

    //Create data array
    var data2 = [trace2];

    //Create layout
    var layout2 = {
        title: `Quantitation of Bacterial Species in Sample ${sampleID}`,
        xaxis: {title: "ID"},
        yaxis: {title: "Bacterial Quantity"},

    };

    //Plot bubble chart using "bubble" id
    Plotly.newPlot("bubble", data2, layout2)

    });
};

init();