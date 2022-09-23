import { useEffect, useState } from "react";
import styled from "styled-components";

type AdUnitType = "banner" | "video" | "native";
const mapAdUnitType: Record<AdUnitType, string> = {
  banner: "Banner",
  video: "Video",
  native: "Native",
};

interface AdUnit {
  adUnitCode: string;
  sizes: Partial<Record<AdUnitType, number[][]>>;
  bidders: string[];
  adUnitPath: string;
}

interface ActiveBidder {
  adUnitCode: string;
  bidderName: string;
  cpm: number;
  currency: string;
  size: string;
}

function App() {
  const [dataConfiguration, setDataConfiguration] = useState<AdUnit[]>([]);
  const [dataActiveBidders, setDataActiveBidders] = useState<ActiveBidder[]>(
    []
  );

  useEffect(() => {
    const handleMessage = (message: MessageEvent<any>) => {
      setDataConfiguration(message.data.dataConfiguration ?? []);
      setDataActiveBidders(message.data.dataActiveBidders ?? []);
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClose = () => {
    window.parent.postMessage("close", "*");
  };

  return (
    <AppBlock>
      <Title>Ad Units Config</Title>
      <TableWrapper>
        <Table>
          <tr>
            <th>Ad Unit Code</th>
            <th>Sizes</th>
            <th>Bidders</th>
            <th>Ad Unit Path</th>
          </tr>
          {dataConfiguration.map(
            ({ adUnitCode, adUnitPath, sizes, bidders }) => (
              <tr>
                <td>{adUnitCode}</td>
                <td>
                  <div>
                    {Object.keys(sizes).map((key) => {
                      const label = mapAdUnitType[key as AdUnitType];
                      const currentSizes = sizes[key as AdUnitType]?.map(
                        (arr) => `(${arr[0]}, ${arr[1]})`
                      );
                      if (currentSizes?.length === 0) {
                        return "None";
                      }

                      return (
                        <div>{`${label}: ${currentSizes?.join(", ")}`}</div>
                      );
                    })}
                  </div>
                </td>
                <td>{bidders.join(", ")}</td>
                <UnitPathCell>{adUnitPath}</UnitPathCell>
              </tr>
            )
          )}
        </Table>
      </TableWrapper>
      <Title>Active Bidders Info</Title>
      {dataActiveBidders.length !== 0 ? (
        <TableWrapper>
          <Table>
            <tr>
              <th>Ad Unit Code</th>
              <th>Bidder Name</th>
              <th>CPM</th>
              <th>Size</th>
            </tr>
            {dataActiveBidders.map(
              ({ adUnitCode, bidderName, cpm, currency, size }, index) => (
                <tr key={adUnitCode + index}>
                  <td>{adUnitCode}</td>
                  <td>{bidderName}</td>
                  <td>
                    {cpm} {currency}
                  </td>
                  <td>{size}</td>
                </tr>
              )
            )}
          </Table>
        </TableWrapper>
      ) : (
        <Title>No Active Bidders Found!</Title>
      )}
      <CloseButton onClick={handleClose}>Close</CloseButton>
    </AppBlock>
  );
}

export default App;

const CloseButton = styled.button`
  background-color: pink;
  padding: 0.5rem;
  margin: 1rem auto;
  border: 1px solid #f28698;
  border-radius: 0.25rem;
  font-size: 16px;
  cursor: pointer;
`;

const AppBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  color: #e68a9a;
  margin-bottom: 0.5rem;
`;
const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const Table = styled.table`
  margin: 0 auto;
  border: 1px solid black;
  border-spacing: 0;
  border-radius: 0.25rem;

  & th {
    padding: 0.25rem;
    background-color: pink;

    &:first-child {
      border-top-left-radius: 0.25rem;
    }

    &:last-child {
      border-top-right-radius: 0.25rem;
    }
  }

  & tr:last-child {
    & td:first-child {
      border-bottom-left-radius: 0.25rem;
    }

    & td:last-child {
      border-bottom-right-radius: 0.25rem;
    }
  }

  & td {
    border: 1px solid black;
    border-left-width: 0;
    border-bottom-width: 0;
    margin: 0;
    padding: 0.5rem;
    background-color: #ffedf0;
    &:last-child {
      border-right-width: 0;
    }
  }
`;

const UnitPathCell = styled.td`
  overflow-x: scroll;
  max-width: 200px;
`;
