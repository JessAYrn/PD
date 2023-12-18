import React from "react";
import { nanoSecondsToMiliSeconds, getDateAsStringMMDDYYY } from "../functionsAndConstants/Utils";
import { GRAPH_DISPLAY_CURRENCIES } from "../functionsAndConstants/Constants";

const dummyLabels = [
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 6)),
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 5)),
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 4)),
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 3)),
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 2)),
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 1)),
    getDateAsStringMMDDYYY(Date.now() - (1000 * 60 * 60 * 24 * 0))
];

const dummyData = {data: [0,0,0,0,0,0,0], fill: false,radius: 2, boarderWidth: 0.5};


const dummyDataset = [
    {labels: dummyLabels, datasets: [{...dummyData, label: GRAPH_DISPLAY_CURRENCIES.icp }]},
    {labels: dummyLabels, datasets: [{...dummyData, label: GRAPH_DISPLAY_CURRENCIES.btc }]},
    {labels: dummyLabels, datasets: [{...dummyData, label: GRAPH_DISPLAY_CURRENCIES.eth }]},
    {labels: dummyLabels, datasets: [{...dummyData, label: GRAPH_DISPLAY_CURRENCIES.icp_staked }]},
    {labels: dummyLabels, datasets: [{...dummyData, label: GRAPH_DISPLAY_CURRENCIES.xdrs }]}
]

export const dummyDateSets = {
    week: dummyDataset,
    month: dummyDataset,
    year: dummyDataset,
    allTime: dummyDataset
};

const parseBigIntsFromBalances = (balances) => {
    let currencies = Object.keys(balances);
    currencies.forEach(currency => {
        let balance = (balances[currency]?.e8s !== undefined) ?  balances[currency]?.e8s : balances[currency];
        balances[currency] = parseInt(balance);
    });
    return balances;
}

const getLabels = (data) => {return data.map(([date, balances]) => {return date})};
const getDataSet = (data_, currency) => {
    const data = data_.map(([date, balances]) => {
        let balance = balances[currency];
        return balances[currency]?.e8s || balances[currency]
    });
    const label = currency.toUpperCase();
    const radius = 2;
    const boarderWidth = 0.5;
    const pointHoverRadius = 5;
    return {data, label, radius, boarderWidth, pointHoverRadius};
};
const getDataSets = (data_) => {
    let currencies = Object.keys(data_[0][1]);
    let datasets = [];
    currencies.forEach(currency => { 
        const set = getDataSet(data_, currency);
        datasets.push(set);
    });
    return datasets;
};

const mapBalancesDataFromApiToFrontend = (data) => {
    let length = data.length;
    if(!length) return dummyDataset;
    const week_dataset = [];
    const month_dataset = [];
    const year_dataset = [];
    const allTime_dataset= [];
    data.forEach(([date, balances], index) => {
        date = parseFloat(date);
        date = nanoSecondsToMiliSeconds(date);
        date = getDateAsStringMMDDYYY(date);
        let coordinate = [date, parseBigIntsFromBalances(balances)];
        if(length - index < 365) year_dataset.push(coordinate);
        if(length - index < 30) month_dataset.push(coordinate);
        if(length - index < 7) week_dataset.push(coordinate);
        allTime_dataset.push(coordinate);
        
    });
    const week = {labels: getLabels(week_dataset), datasets: getDataSets(week_dataset)};
    const month = {labels: getLabels(month_dataset), datasets: getDataSets(month_dataset) };
    const year = {labels: getLabels(year_dataset), datasets: getDataSets(year_dataset)};
    const allTime = {labels: getLabels(allTime_dataset), datasets: getDataSets(allTime_dataset)}

    return {week, month, year, allTime};
};

export default  mapBalancesDataFromApiToFrontend;