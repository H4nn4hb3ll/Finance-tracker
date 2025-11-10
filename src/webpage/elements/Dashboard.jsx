import React, {useState, useEffect} from "react";
import * as Facade from "./Facade.js";
import TransactionsTable from "./DashboardElements/TransactionTable.jsx";
import AccountBox from "./DashboardElements/AccountBox.jsx";
import Chart from "./DashboardElements/Chart.jsx";

export default function Dashboard({ username }) {
  const [accessToken, setAccessToken] = useState(null);
  let [accounts, setAccounts] = useState(null);
  let [groupedAccounts, setGroupedAccounts] = useState([]);
  let [renderAccSelector, setRenderAccSelector] = useState(false);
  let [accountIndex, setAccountIndex] = useState(0);
  let serverAddress = "http://localhost:3333";
  let [chartData, setChartData] = useState();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]

  //every time a new account is selected or if the accounts change, update the chart data
  useEffect(() => {
    if (!groupedAccounts || groupedAccounts.length == 0) return;
    setChartData(
      months.map((monthName, monthIdx) => {
        let income = groupedAccounts[accountIndex].transactions
          .filter(
            (t) => t.amount > 0 && new Date(t.date).getMonth() == monthIdx
          )
          .reduce((sum, t) => sum + t.amount, 0);
        let expenses = groupedAccounts[accountIndex].transactions
          .filter(
            (t) => t.amount < 0 && new Date(t.date).getMonth() == monthIdx
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return {
          month: monthName,
          income,
          expenses,
        };
      })
    );
  }, [accountIndex, groupedAccounts]);

  //whenever the accounts change, group them for easier parsing dispaly
  useEffect(() => {
    if (!accounts || !accounts.accounts) return;
    console.log(accounts);
    setGroupedAccounts(
      // for each account map the data into an array
      accounts.accounts.map((acc) => ({
        ...acc,
        transactions: [
          //add the whole category, just filter out anything that doesnt match the current id
          ...(accounts.transactions?.filter(
            (t) => t.account_id === acc.account_id
          ) ?? []),
        ],
      }))
    );
  }, [accounts]);

  async function linkToken() {
    try {
      const data = await Facade.createLinkToken(username);
      const linkToken = data.link_token;

      if (!linkToken) {
        alert("Error creating link token");
        console.error("No link_token returned from backend:", data);
        return;
      }

      const LinkHandler = Plaid.create({
        token: linkToken,
        onSuccess: async function (publicToken, metadata) {
          try {
            const tokenResponse = await Facade.getAccessToken(publicToken);
            console.log("Access token response:", tokenResponse);

            const accessToken = tokenResponse.accessToken;
            
            if (!accessToken) {
              alert("No access token received from backend!");
              console.error("Unexptedted access token response");
              return;
            }

            setAccessToken(accessToken);

            const data = await Facade.getTransactions(accessToken);
            setAccounts(data);

            alert("Link was successful!")
            console.log("Access token:", accessToken);
          } catch (error) {
            console.error("Error fetching transactions:", error)
          }
          
        },
        onExit: function (err, metadata) {
          if (err) console.error("Plaid link error:", err);
        },
      });

      LinkHandler.open();
    } catch (error) {
      console.error("Error linking account:", error);
    }
  }

  async function refreshTransactions() {
    if (!accessToken) {
      alert("Please link an account first.");
      return;
    }
    const data = await Facade.getTransactions(accessToken);
    setAccounts(data);
  }

  return (
    <div className="bg-gradient">
      <div className="frosted-box">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {username}!</h1>
        <p className="mb-6 text-black/80">You are now logged in.</p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={linkToken}
            className="btn-purple"
          >
            Link Bank Account
          </button>
          <button
            onClick={() => setRenderAccSelector(true)}
            className="btn-purple"
          >
            Select Account
          </button>
          <button
            onClick={refreshTransactions}
            className="btn-purple"
          >
            Refresh Transactions
          </button>
        </div>

        {/* Account Selector */}
        {renderAccSelector && (
          <AccountBox
            accounts={groupedAccounts}
            setIndex={setAccountIndex}
            terminate={() => setRenderAccSelector(false)}
          />
        )}

        {/* Chart */}
        {chartData && chartData.length > 0 && <Chart chartData={chartData} />}

        {/* Transaction Table */}
        {groupedAccounts.length > 0 ? (
          <TransactionsTable account={groupedAccounts[accountIndex]} />
        ) : (
          <p>Nothing to display yet</p>
        )}
      </div>
    </div>
  );
}