import * as React from 'react';
import * as UICore from '@da/ui-core';

// ------------------------------------------------------------------------------------------------
// Schema version (all config files will need to export this name)
// ------------------------------------------------------------------------------------------------
export const version = {
  schema: 'navigator-config',
  major: 2,
  minor: 0,
};

export function theme(userId, party, role) {
    return (    party == "Customer" ? { documentBackground: "#344a83", colorPrimary: ["grey","white"], colorSecondary: ["grey","white"] } :
                party == "Repairer" ? { documentBackground: "Blue", colorPrimary: ["grey","white"], colorSecondary: ["grey","white"] } :
                party == "Ins_Claim_A" ? { documentBackground: "#4c566e", colorPrimary: ["grey","white"], colorSecondary: ["grey","white"] } : //, colorPrimary: ["#C9C8CA", "White"], colorSecondary: ["#4f93de", "White"] }: //Grey700
                party == "Ins_Claim_B" ? { documentBackground: "#4c512e",  colorPrimary: ["grey","white"], colorSecondary: ["grey","white"] } :
                party == "Ins_Claim_C" ? { documentBackground: "Green",  colorPrimary: ["grey","white"], colorSecondary: ["grey","white"] } :
                party == "Ins_Pay_B" || party == "Ins_Pay_A" || party == "Ins_Pay_C"   ? { documentBackground: "Orange",  colorPrimary: ["grey","white"], colorSecondary: ["grey","white"] } :
           { documentBackground: "#800000" });
           //`linear-gradient(45deg, ${White}, ${Grey600})`

  };
   
var formatTime = function(timestamp) { return timestamp.substring(0, 10) + " " + timestamp.substring(11, 16); };
var formatDate = function(timestamp) { return timestamp.substring(0, 10); };
var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
var formatDateIntoDDMMMYYYY = function(date) { return date.substring(8,10) + "-" + month_names[date.substring(5,7)-1] + "-" + date.substring(0,4); };
var temp = function() {
    console.log(document)
    var link = document.createElement("a");
    link.textContent = "SAVE AS CSV";
    link.download = "file.csv";
    //link.href = "data:text/csv,h1;All Questions\n"
    var x = document.getElementsByClassName("sc-iQKALj bUqlEJ");
    x.appendChild(link);
    location.reload();

    //document.body.appendChild(link);
    //alert("asdasd")
}
var templateIdIncludesSubstrings = function(templateId, substrings) {
    

    substrings.forEach(s => { 
        console.log(s);
        console.log(templateId);
        console.log(templateId.includes(s));
        if(templateId.includes(s)) return true 
    });
    return false;
}

var createColumn = function(key, title, projection, width = 100, weight = 0, alignment = "left", sortable = true) {
    


    var createCell = function (data) {
        return { type: 'text', value: projection(data.rowData) }
    };

    return {
        key: key,
        title: title,
        createCell: createCell,
        sortable: sortable,
        width: width,
        weight: weight,
        alignment: alignment
    }
};

var policies = {
    type: 'table-view',
    title: "Policies",
    source: { type: 'contracts', filter: [ { field: "template.id", value: "Policy" } ], search: "", sort: [ { field: "id", direction: "ASCENDING" } ] },
    columns: [
        createColumn("id", "ContractId", x => x.id, 10),
        createColumn("customer", "Customer", x => x.argument.fields[0].value.value, 10),
        createColumn("insurer", "Insurer", x => x.argument.fields[1].value.value, 10),  
        createColumn("policyID", "PolicyID", x =>  x.argument.fields[3].value.value, 10),
        createColumn("startDate", "startDate", x => x.argument.fields[5].value.value, 10),
        createColumn("endDate", "endDate", x => x.argument.fields[6].value.value, 10),
    ]
},

claims = {
    type: 'table-view',
    title: "Claims",
    source: { type: 'contracts', filter: [ { field: "template.id", value: "FNOL" }], search: "", sort: [ { field: "id", direction: "ASCENDING" } ] },
    columns: [
        createColumn("id", "ContractId", x => x.id, 5),
        createColumn("policyID", "Policy ID", x => x.template.id.includes(":FNOLRequest@") ? x.argument.fields[1].value.value : x.argument.fields[2].value.value, 5),
        createColumn("InvolvedInsurer", "InvolvedInsurer", x => x.template.id.includes(":FNOLRequest@") ? x.argument.fields[2].value.value.map(item =>  item.fields[0].value.value ).join(";") : JSON.stringify(x.argument.fields[4].value.fields[0].value.value.map(item => item.key.value)).replace(/['"]+/g, ''), 100),
        createColumn("claimAgainst", "ClaimAgainst", x => x.template.id.includes(":FNOLRequest@")  ? "N/A" : x.argument.fields[7].value.value ===null ? "" : x.argument.fields[7].value.value.value, 20),
        createColumn("AgreedInsurer", "AgreedInsurer", x => x.template.id.includes(":FNOLRequest@") ? "N/A"  : JSON.stringify(x.argument.fields[6].value.fields[0].value.value.map(item => item.key.value)).replace(/['"]+/g, ''), 10),
        createColumn("TotalCost", "TotalCost", x => x.template.id.includes(":FNOLRequest@") ? "$0" : "$ " +  x.argument.fields[5].value.value.map(item =>  item.fields[1].value.value).reduce((a,b) => Number(a) + Number(b),0), 5),
    ]
},

settlement = {
    type: 'table-view',
    title: "Settlement",
    source: { type: 'contracts', filter: [ { field: "template.id", value: "ClaimSettlement" }], search: "", sort: [ { field: "id", direction: "ASCENDING" } ] },
    columns: [
        createColumn("id", "ContractId", x => x.id, 15),
        createColumn("atFaultParty", "atFaultParty",  x => x.template.id.includes(":ClaimSettlementRequest@") ? JSON.stringify(x.argument.fields[1].value.fields[0].value.value).replace(/['"]+/g, '') :  JSON.stringify(x.argument.fields[0].value.fields[1].value.fields[0].value.value).replace(/['"]+/g, ''), 10),
        createColumn("claimInsurer", "ClaimInsurer", x => x.template.id.includes(":ClaimSettlementRequest@") ?  x.argument.fields[2].value.value : x.argument.fields[0].value.fields[2].value.value, 10),
        createColumn("InvoledParties", "InvoledParties", x => x.template.id.includes(":ClaimSettlementRequest@") ? JSON.stringify(x.argument.fields[0].value.value.map(item => item.fields[0].value.fields[0].value.value)).replace(/['"]+/g, '') : JSON.stringify(x.argument.fields[4].value.fields[0].value.value.map(item => item.key.value)).replace(/['"]+/g, ''), 30),
        createColumn("TotalCost", "TotalCost", x => x.template.id.includes(":ClaimSettlementRequest@") ? "$ " +x.argument.fields[0].value.value.map(item => item.fields[1].value.value).reduce((a,b) => Number(a) + Number(b),0): "$ " +  x.argument.fields[0].value.fields[0].value.value.map(item => item.fields[1].value.value).reduce((a,b) => Number(a) + Number(b),0), 5),
    ]
},


payments = {
    type: 'table-view',
    title: "InsurancePayment",
    source: { type: 'contracts', filter: [ { field: "template.id", value: "InsurancePayment" } ], search: "", sort: [ { field: "id", direction: "ASCENDING" } ] },
    columns: [
        createColumn("id", "ContractId", x => x.id, 10),
        createColumn("from", "From", x => x.argument.fields[0].value.value, 50),
        createColumn("to", "To", x => x.argument.fields[1].value.value, 20),
        createColumn("payer", "payer", x => x.argument.fields[2].value.value, 20),
        createColumn("amount", "amount", x => "$ " + x.argument.fields[3].value.value, 50),
    ]
},
invoices = {
    type: 'table-view',
    title: "Payment Instructions",
    source: { type: 'contracts', filter: [ { field: "template.id", value: "PaymentInstruction" } ], search: "", sort: [ { field: "id", direction: "ASCENDING" } ] },
    columns: [
        createColumn("id", "ContractId", x => x.id, 10),
        createColumn("from", "From", x => x.argument.fields[0].value.value, 50),
        createColumn("to", "To", x => x.argument.fields[1].value.value, 20),
        createColumn("customerName", "customerName", x => x.argument.fields[2].value.value, 20),
        createColumn("amount", "amount", x => "$ " + x.argument.fields[3].value.value, 50),
        createColumn("paymentParty", "paymentParty", x =>  x.argument.fields[4].value.value, 50),

    ]
};

;


export function customViews(userId, party, role){
    return (    
    party == "Customer" ?
    {
        policies: policies,
        claims: claims,
        settlement : settlement,
    } :
    party == "Repairer" ?
    { 
        claims: claims,
        invoices: invoices,
        payments: payments
    } :
    party == "Ins_Claim_A" || party == "Ins_Claim_B" || party == "Ins_Claim_C" ?
    { 
        claims: claims,
        settlement: settlement,
        invoices: invoices,        
        payments: payments
    } :
    party == "Ins_Pay_B" || party == "Ins_Pay_A" || party == "Ins_Pay_C" ?
    { 
        settlement: settlement,
        invoices: invoices,
        payments: payments
    }  :
    { 
        claims: claims
    }
);
}
