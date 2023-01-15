import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {fetchBrokersRequest} from "../../store/actions/brokersActions";
import {fetchCarriersRequest} from "../../store/actions/carriersActions";
import AddBroker from "../../components/Modals/AddBroker";
import InnerContainer from "../../components/InnerContainer/InnerContainer";
import InnerTable from "../../components/Table/InnerTable";
import TableHeaderRow from "../../components/Table/TableHeader/TableHeaderRow";
import BrokerTableBody from "../../components/Table/TableBody/BrokerTableBody";

const columns = [
    {key: 'arrow'},
    {key: 'name', label: 'Broker'},
    {key: 'phoneNumber', label: 'Phone Number'},
    {key: 'mc', label: 'MC'},
    {key: 'description', label: 'Description'},
    {key: 'companiesContract'},
];

const Brokers = () => {
    const dispatch = useDispatch();
    const brokers = useSelector(state => state.brokers.brokers);

    useEffect(() => {
        dispatch(fetchBrokersRequest());
        dispatch(fetchCarriersRequest());
    }, [dispatch]);

    return (
        <>
            {brokers &&
                <InnerContainer>
                    <Grid item sx={{paddingLeft: "15px"}}>
                        <Typography variant="h5" fontWeight="bold" textTransform="uppercase">
                            Brokers
                        </Typography>
                    </Grid>
                    <Grid container item flexDirection="row" justifyContent="space-between" alignItems="center"
                          paddingRight="15px">
                        <AddBroker/>
                    </Grid>

                    <InnerTable
                        header={<TableHeaderRow headerCells={columns} data={true}/>}
                        body={
                            <BrokerTableBody
                                columns={columns}
                                brokers={brokers}
                            />
                        }
                    />
                </InnerContainer>
            }
        </>
    );
};

export default Brokers;