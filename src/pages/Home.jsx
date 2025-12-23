import axios from "axios";
import React, { useState } from "react";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { Elastic } from "gsap/dist/gsap";

gsap.registerPlugin(ScrollTrigger);

///regex dekhna hai badme
function parseCondition(cond) {
  const regex = /(.*?)(>=|<=|=|>|<)(.*)/;
  const match = cond.match(regex);
  if (!match) return null;

  return {
    field: match[1].trim(), // e.g. "Market capitalization"
    operator: match[2].trim(), // e.g. ">"
    value: match[3].trim(), // e.g. "500"
  };
}

function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const elementref = useRef(null);

  useGSAP(() => {
    gsap.to(elementref.current, {
      opacity: 0,
      scale: 0.7,

      scrollTrigger: {
        trigger: elementref.current,
        start: "top 0%",
        end: "bottom 10%",
        scrub: true,

        markers: true,
      },
    });
  });

  const tickerToName = {
    META: "Meta Platforms, Inc.", // formerly Facebook :contentReference[oaicite:0]{index=0}
    NVDA: "NVIDIA Corporation", // NVIDIA
    GOOGL: "Alphabet Inc.",
    INTC: "Intel Corporation",
    TSLA: "Tesla, Inc.",
    MSFT: "Microsoft Corporation",
    IBM: "International Business Machines Corporation",
    AMD: "Advanced Micro Devices, Inc.",
    ORCL: "Oracle Corporation",
    CRM: "Salesforce, Inc.",
    ADBE: "Adobe Inc.",
    CSCO: "Cisco Systems, Inc.",
    QCOM: "Qualcomm Incorporated",
    UBER: "Uber Technologies, Inc.",
    LYFT: "Lyft, Inc.",
    JPM: "JPMorgan Chase & Co.",
    PYPL: "PayPal Holdings, Inc.",
    SHOP: "Shopify Inc.",
    C: "Citigroup Inc.",
    WFC: "Wells Fargo & Company",
    MS: "Morgan Stanley",
    AXP: "American Express Company",
    GS: "The Goldman Sachs Group, Inc.",
    AAPL: "Apple Inc.",
    PNC: "PNC Financial Services Group, Inc.",
    COF: "Capital One Financial Corporation",
    BAC: "Bank of America Corporation",
    USB: "U.S. Bancorp",
    "BRK-B": "Berkshire Hathaway Inc. (Class B)",
    V: "Visa Inc.",
    MA: "Mastercard Incorporated",
    SCHW: "The Charles Schwab Corporation",
    RY: "Royal Bank of Canada",
    HSBC: "HSBC Holdings plc",
    AMZN: "Amazon.com, Inc.",
    CME: "CME Group Inc.",
    DB: "Deutsche Bank AG",
    JNJ: "Johnson & Johnson",
    ABBV: "AbbVie Inc.",
    TD: "The Toronto-Dominion Bank",
    GILD: "Gilead Sciences, Inc.",
    AMGN: "Amgen Inc.",
    BLK: "BlackRock, Inc.",
    LLY: "Eli Lilly and Company",
    CVS: "CVS Health Corporation",
    BMY: "Bristol-Myers Squibb Company",
    DHR: "Danaher Corporation",
    MDT: "Medtronic plc",
    ISRG: "Intuitive Surgical, Inc.",
    VRTX: "Vertex Pharmaceuticals Incorporated",
    REGN: "Regeneron Pharmaceuticals, Inc.",
    ILMN: "Illumina, Inc.",
    ZBH: "Zimmer Biomet Holdings, Inc.",
    XOM: "Exxon Mobil Corporation",
    UNH: "UnitedHealth Group Incorporated",
    PFE: "Pfizer Inc.",
    SYK: "Stryker Corporation",
    HUM: "Humana Inc.",
    BP: "BP p.l.c.",
    SHEL: "Shell plc",
    CVX: "Chevron Corporation",
    MPC: "Marathon Petroleum Corporation",
    MRK: "Merck & Co., Inc.",
    EOG: "EOG Resources, Inc.",
    BIIB: "Biogen Inc.",
    OXY: "Occidental Petroleum Corporation",
    VLO: "Valero Energy Corporation",
    SLB: "Schlumberger Limited",
    BKR: "Baker Hughes Company",
    CNQ: "Canadian Natural Resources Limited",
    HAL: "Halliburton Company",
    WMT: "Walmart Inc.",
    KMI: "Kinder Morgan, Inc.",
    PSX: "Phillips 66",
    HD: "The Home Depot, Inc.",
    SU: "Suncor Energy Inc.",
    ENB: "Enbridge Inc.",
    NKE: "NIKE, Inc.",
    COST: "Costco Wholesale Corporation",
    EQNR: "Equinor ASA",
    TGT: "Target Corporation",
    LOW: "Lowe's Companies, Inc.",
    MCD: "McDonald's Corporation",
    PEP: "PepsiCo, Inc.",
    COP: "ConocoPhillips",
    PG: "The Procter & Gamble Company",
    UL: "Unilever plc",
    KO: "The Coca-Cola Company",
    MDLZ: "Mondelez International, Inc.",
    CL: "Colgate-Palmolive Company",
    DEO: "Diageo plc",
    PM: "Philip Morris International Inc.",
    MO: "Altria Group, Inc.",
    F: "Ford Motor Company",
    GM: "General Motors Company",
    KHC: "The Kraft Heinz Company",
    RIVN: "Rivian Automotive, Inc.",
    KMB: "Kimberly-Clark Corporation",
    SBUX: "Starbucks Corporation",
    TAP: "Molson Coors Beverage Company",
    GE: "General Electric Company",
    MMM: "3M Company",
    BA: "The Boeing Company",
    CAT: "Caterpillar Inc.",
    LCID: "Lucid Group, Inc.",
    DE: "Deere & Company",
    HON: "Honeywell International Inc.",
    RTX: "RTX Corporation",
    GD: "General Dynamics Corporation",
    NXPI: "NXP Semiconductors N.V.",
    ASML: "ASML Holding N.V.",
    MU: "Micron Technology, Inc.",
    NOC: "Northrop Grumman Corporation",
    AVGO: "Broadcom Inc.",
    TXN: "Texas Instruments Incorporated",
    LMT: "Lockheed Martin Corporation",
    TSM: "Taiwan Semiconductor Manufacturing Company",
  };

  const getResult = async () => {
    const conditions = text.split("AND").map((c) => c.trim());
    const parsed = conditions.map(parseCondition).filter(Boolean);

    console.log("Parsed conditions:", parsed);

    try {
      const url = "http://localhost:5000/database/conditionalstock";
      const res = await axios.post(url, parsed);
      setResult(res.data);

      console.log("API result:", res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="w-screen min-h-screen  overflow-scroll dark:bg-[#1a1a1a] text-shadow-stone-300">
      {/* <div class="w-96 h-96 rounded-full bg-white/10 animate-spin-slow opacity-50"></div> */}
      <div className="w-screen text-white  bg-[rgba(217,217,217,0.01)] text-2xl grid grid-cols-5 p-2 sticky mt-2 gap-x-12 md:grid-cols-8 md:gap-x-20 lg:grid-cols-10 lg:gap-x-9 ">
        <div className="hover:text-black hover:border-0 border-b-[.01vh] px-2 ">
          {" "}
          Home
        </div>
        <div className="hover:text-black  px-2 "> About</div>
        <div className="hover:text-black  px-2  "> Project</div>
        <div className="hover:text-black  px-2  "> Tech</div>
      </div>
      <div className="bg-white w-screen border-[1px] "></div>

      <div
        className="flex items-center justify-center mb-4 mt-2 "
        ref={elementref}
      >
        <div className="box-border backdrop-blur-sm border text-white  border-white/10 bg-[rgba(0,0,0,.2)] h-[60vh]  w-[40vw] md:w-[30vw]   gap-4 rounded-4xl shadow-2xl p-7 flex flex-col">
          <h1 className="text-3xl md:text-4xl">Query</h1>
          <p className=" text-sm  lg:text-lg  ">
            marketcap {">"}1000000000000 AND <br />
            trailingpe {"< "}30 AND <br />
            returnonequity {">"} 0.4 AND <br />
            symbol = META
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              getResult();
            }}
            className="flex flex-col gap-4 h-full"
          >
            <textarea
              className="bg-blend-color border-none hover:border-[1px] h-full text-white p-3 "
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <button
              type="submit"
              className="bg-blue-700 w-[28vw] md:w-[18vw] lg:w-[13vw] rounded-xl p-3 hover:bg-blue-800"
            >
              Run This Query
            </button>
          </form>
        </div>
      </div>
      {result && (
        <div className=" min-w-screen bg-transparent text-white p-3 mt-9">
          {result &&
            result.map((res) => {
              return (
                <div className="flex flex-col ">
                  <div
                    id="renderelement"
                    className=" grid  grid-cols-6 w-full text-cente justify-evenly it gap-4 "
                  >
                    <div>{tickerToName[res.symbol]} </div>
                    <div>{res.regularmarketprice} </div>
                    <div>{res.returnonequity} </div>
                    <div>{res.trailingpe} </div>

                    <div>{res.bookvalue} </div>
                    <div
                      className="h-full w-full bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 border border-gray-100
"
                    >
                      {res.dividendrate}{" "}
                    </div>
                  </div>
                  <div className="bg-black w-full h-[0.5px]"></div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Home;

// text ===""
//             ? "http://localhost:3000/database/getallstock"
//             :
