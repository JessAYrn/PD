import React, { useMemo, useState } from "react";
import {Line, Bar, Pie} from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { CHART_TYPES, GRAPH_TIME_FRAMES, GRAP_DISPLAY_CURRENCIES } from "../../functionsAndConstants/Constants";
import { Paper } from "@mui/material";
import "./Chart.scss";
import MenuField from "./MenuField";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CellTowerIcon from '@mui/icons-material/CellTower';
import DateRangeIcon from '@mui/icons-material/DateRange';
Chart.register(...registerables);

const Graph = (props) => {
    const {
        type, 
        // inputData
    } = props

    const [timeFrame, setTimeFrame] = useState(GRAPH_TIME_FRAMES.day);
    

    const inputData = {
        day: {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11],
            datasets : [
                {
                    label: GRAP_DISPLAY_CURRENCIES.icp,
                    data: [10,20,30,50,10,20,30,50,10,20,30,50],
                    backgroundColor: ["green"]
                },
                {
                    label: GRAP_DISPLAY_CURRENCIES.all,
                    data: [10,20,30,40],
                    backgroundColor: ["red"]
                }
            ]
        },
        week: {
            labels: [0,7,14,21],
            datasets : [
                {
                    label: GRAP_DISPLAY_CURRENCIES.icp,
                    data: [13,28,34,59],
                    backgroundColor: ["green"]
                },
                {
                    label: GRAP_DISPLAY_CURRENCIES.all,
                    data: [14,26,34,42],
                    backgroundColor: ["red"]
                }
            ]
        },
        month: {
            labels: [0,30,60,90],
            datasets : [
                {
                    label: GRAP_DISPLAY_CURRENCIES.icp,
                    data: [30,20,10,80],
                    backgroundColor: ["green"]
                },
                {
                    label: GRAP_DISPLAY_CURRENCIES.all,
                    data: [40,40,30,80],
                    backgroundColor: ["red"]
                }
            ]
        },
        year: {
            labels: [0,365,730,1095],
            datasets : [
                {
                    label: GRAP_DISPLAY_CURRENCIES.icp,
                    data: [104,205,303,5022],
                    backgroundColor: ["green"]
                },
                {
                    label: GRAP_DISPLAY_CURRENCIES.all,
                    data: [10,20,30,40],
                    backgroundColor: ["red"]
                }
            ]
        },
        allTime: {
            labels: [0,500,1000,1500],
            datasets : [
                {
                    label: GRAP_DISPLAY_CURRENCIES.icp,
                    data: [102,2022,30222,5022],
                    backgroundColor: ["green"]
                },
                {
                    label: GRAP_DISPLAY_CURRENCIES.all,
                    data: [10,20,30,40],
                    backgroundColor: ["red"]
                }
            ]
        }
    };

    const [labelDisplayed, setLabelDisplayed] = useState(inputData[Object.keys(inputData)[0]]?.datasets[0]?.label);



    const data = useMemo(() => {
        let set = inputData[timeFrame];
        let dataset = set.datasets.find(dataset => dataset.label === labelDisplayed);
        return {...set, datasets: [dataset]};
    },[timeFrame, labelDisplayed]);


    const mainMenuItemProps_label = inputData[Object.keys(inputData)[0]]?.datasets?.map(
        ({label}) => { return {text: label, onClick: () => setLabelDisplayed(label)} }
    );

    const mainMenuItemProps_time = Object.keys(inputData)?.map(key => {
        return {text: key, onClick: () => setTimeFrame(key)}
    });

    let Chart_ = Line;
    if(type === CHART_TYPES.bar) Chart_ = Bar;
    if (type === CHART_TYPES.pie) Chart_ = Pie;

    return (
        <Grid
        xs={12}
        display="flex"
        flexDirection={"column"}
        justifyContent="center" 
        alignItems="center" 
        >
            <Grid
            xs={12}
            display="flex"
            justifyContent="left" 
            alignItems="center" 
            >
                <MenuField
                    MenuIcon={CellTowerIcon}
                    xs={8}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"left"}
                    active={true}
                    color={"custom"}
                    menuItemProps={mainMenuItemProps_label}
                    margin={0}
                />
                <MenuField
                    MenuIcon={DateRangeIcon}
                    xs={8}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"right"}
                    active={true}
                    color={"custom"}
                    menuItemProps={mainMenuItemProps_time}
                    margin={0}
                />
            </Grid>
            <Paper className="chart paper">
                <Chart_ data={data}/>
            </Paper>
        </Grid>
    )
};

export default Graph;