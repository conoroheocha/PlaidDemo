import React, { useState } from "react";

// structure of the data as received from the API
interface BalanceData {
    balances:
    { current: number, },
    name: String
}

interface Data {
    showTable: boolean,
    accountList: Array<BalanceData>
}

//https://stackoverflow.com/questions/35844783/how-do-i-iterate-through-table-rows-and-cells-in-reactjs
const BalanceTable: React.FC<Data> = (props: Data) => {
    return (
        <div>
            {props.showTable &&
                (<table>
                    <thead>
                        <tr>
                            <th>Account</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.accountList.map((account, index) => {
                            return (
                                <tr key={index}>
                                    <td>{account.name}</td>
                                    <td>{account.balances.current}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>)}
        </ div>
    );
}




export default BalanceTable;