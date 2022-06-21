# daml-insurance-claim

## Introduction

This project is a showcase of using DAML smart contracts to build a multiparty workflow. It is based on a simplified insurance claim use case. 

## How to run this project

Simply run 

`daml start` 

in root folder of the project. It will do the following.

1. Compile the code
2. Create a Daml sandbox with the Daml packages and expose the grpc interface
3. Create a Daml Navigator on top of the grpc interface
4. Run the init-script defined in [daml.yaml](/daml.yaml) on the sandbox instance
5. Start a browser connecting to the Navigator on localhost:3000

Now you can pickup a party in your browser and try out the smart contracts. 

_NOTE: The UI is using customised react configuration and it is out of support. The configuration file is [frontend-config.js](/frontend-config.js)_


## Involved Party

The first thing in designing a smart contract is to decide which party is involved and the role each party is going to play in the workflow. In [Setup.daml](/daml/Setup.daml), we named the following parties for this sample.

Party | Description | 
---------------------- | ---------------------- | 
Ins_Claim_A | Insurance Company A's Claim department | 
Ins_Claim_B | Insurance Company B's Claim department | 
Ins_Claim_C | Insurance Company C's Claim department | 
Ins_Pay_A | Insurance Company A's Accounts department | 
Ins_Pay_B | Insurance Company B's Accounts department | 
Ins_Pay_C | Insurance Company C's Accounts department | 
Customer | This party represents the customer  | 
Repairer | This represents all the repairers and all the insurance companies share the same repairer | 

## Workflow

The below table describes a workflow from insurance policy creation, customer claim to the final insurance payment. The sample workflow can be found script `test1` in [Test.daml](/daml/Test.daml)

Order | Acting Party | Choice | Description |
---------------------- | ---------------------- | ---------------------- | ---------------------- | 
1|Customer | PolicyRequest | Customer submit a request to the insurance company to buy a policy | 
2|Ins_Claim_A | ApprovePolicy | Insurance company A accept the request and create the **Policy** contract | 
3|Customer | LodgeClaim | Customer lodges a claim and a **FNOLRequest** contract is created (FNOL: Fist Notice Of Loss) | 
4|Ins_Claim_A | AcceptClaimRequest | The customer's insurer accepts the claim and creates **FNOL** contract| 
5|Ins_Claim_B and Ins_Claim_C | AddFact | Involved insurance company B and C add their sides of story to the **FNOL** contract | 
5|Repairer | AddCost | Add cost figures to **FNOL** contract for fixing cars insured by company A, B and C | 
6|Ins_Claim_A, Ins_Claim_B and Ins_Claim_C | AgreeOnWhotoPay | All involved insurance company must agree on who is at fault and cover the cost. When everyone agrees, a new contract **ClaimSettlementRequest** is created and assigned to the at fault party | 
7|Ins_Claim_B | AcceptClaimSettlementRequest | Insurance company that at fault accepts the settlement request and this creates a new contract **ClaimSettlement**. The claim settlement is assigned to accounts department
8|Ins_Pay_B | CreatePayment | The account department of the insurance company exercises the choice. It creates **PaymentInstruction** contracts and notify the payment receivers.
9|Ins_Pay_A, Ins_Pay_B and Ins_Pay_C | Accept | By accepting the **PaymentInstruction**, the receiving party gets **Payment** contract and it represents cash payment in this exapmle. 

## Other Considerations

This sample is a proof of concept and there are many areas can be improved. The Repairer party can be further split into different repairing networks serving different insurance companies. More Customer party can be added to get other customers into the claim workflow. 

Although the project covers the full end to end workflow, each domain by itself can be a seperate project. Such as relationship management among the repaires and insurance companies; The customer KYC information management; The insurance payment consolidation and settlement.