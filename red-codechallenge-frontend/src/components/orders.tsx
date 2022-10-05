
import { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import { Container,TableContainer,Checkbox } from '@mui/material';

const Orders = () => {
    const [orders, setOrders] = useState<any>(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await fetch(`https://localhost:7239/api/Orders`);
                const data = await response.json();
                setOrders(data);
            }
            catch (error)
            {
                console.log(error);
            }
        }

        if (!orders)
        {
            getOrders();
        }
    }, [orders])

    const renderTable = () => {
        if(orders)
        {
            return orders.map(order => (
                <TableRow key={ order.id }>
                    <TableCell><Checkbox/></TableCell>
                    <TableCell>{ order.id }</TableCell>
                    <TableCell>{ order.createdDate }</TableCell>
                    <TableCell>{ order.createdByUserName }</TableCell>
                    <TableCell>{ order.orderType }</TableCell>
                    <TableCell>{ order.customerName }</TableCell>
                    <TableCell><EditIcon/></TableCell>
                </TableRow>
            ));

            // for(let value of orders.values()){
            //     console.log(value.id);
            // }
        }
    }

    return(
        <Container maxWidth="lg" style={{maxWidth:'100%'}}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th"><Checkbox/></TableCell>
                            <TableCell component="th">Order ID</TableCell>
                            <TableCell component="th">Creation Date</TableCell>
                            <TableCell component="th">Created By</TableCell>
                            <TableCell component="th">Order Type</TableCell>
                            <TableCell component="th">Customer</TableCell>
                            <TableCell component="th"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { renderTable() } 
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default Orders;