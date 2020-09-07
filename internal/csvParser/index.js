import csv from 'csvtojson';
import path from 'path';
import fs from 'fs';

const levels = [
    {
        label: 'Environment',
        children: [{
            label: 'Operations',
            children: [
                { label: 'Supply Chain Environment' },
                { label: 'Raw Materials' },
                { label: 'Energy & Emissions' },
                { label: 'Land Use' },
                { label: 'Water Use' },
                { label: 'Waste' },
                { label: 'General Operations' },
            ]
        }, {
            label: 'End Product',
            children: [
                { label: 'Environment Product Sustainability' },
                { label: 'Products & Services Environmental Incidents' },
            ]
        }]
    }, {
        label: 'Social',
        children: [{
            label: 'Human Capital',
            children: [
                { label: 'Supply Chain Social' },
                { label: 'Employee Safety & Treatment' },
                { label: 'Evidence of Meritocracy' },
            ]
        }, {
            label: 'Society',
            children: [
                { label: 'Society & Community Relations' },
            ]
        }, {
            label: 'End Product',
            children: [
                { label: 'Social Product Sustainability' },
                { label: 'Product Impact on Human Health & Society' },
                { label: 'Product Quality & Customer Incidents' },
            ]
        }]
    }, {
        label: 'Ethics',
        children: [
            { label: 'Business Ethics' },
            { label: 'Bribery & Corruption' },
            { label: 'Lobbying & Public Policy' },
            { label: 'Accounting & Taxation' },
            { label: 'Board & Management Conduct' },
            { label: 'ESG Accountability' },
        ]
    }, {
        label: 'Data Incidents',
        children: [
            { label: 'Data Privacy Incidents' },
        ]
    }
];

const safeStr = str => str.replace(/ /gi, '').replace(/&/, '');

const buildId = (pre) => (item) => {
    const itemId = safeStr(item.label);
    if (pre) {
        return `${pre}__${itemId}`;
    }
    return itemId;
}

const flattenLevel = (pre) => (item) => {
    const itemId = buildId(pre)(item);
    const decoratedItem = {
        id: itemId,
        label: item.label,
    }

    if (item.children && item.children.length) {
        return [
            decoratedItem,
            ...item.children.flatMap(flattenLevel(itemId))
        ]
    }

    return [decoratedItem];
}

function run() {
    const filePath = process.argv[2];
    const newFileName = process.argv[3];

    if (!filePath) {
        console.log(process.argv);
        throw new Error('Missing "csv file path" arg - ie npx run <csvfilepath> <filename.json>');
    }

    if (!newFileName) {
        console.log(process.argv);
        throw new Error('Missing "file name" arg - ie npx run <csvfilepath> <filename.json>');
    }

    const pathToCsv = path.resolve(__dirname, filePath);

    csv()
        .fromFile(pathToCsv)
        .then((jsonObj) => {

            // console.log(jsonObj);

            const totals = {
                companies: jsonObj.length
            }

            console.log(totals);
            /**
             * [
             * 	{a:"1", b:"2", c:"3"},
             * 	{a:"4", b:"5". c:"6"}
             * ]
             */

            // fs.writeFile(filename, data, [encoding], [callback])
        })
        .catch((e) => {
            throw new Error(`Check that the "pathToCsv" is correct (${pathToCsv}) - original error: ${e}`)
        })
}

run();