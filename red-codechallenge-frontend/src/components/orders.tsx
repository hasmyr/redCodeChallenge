
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import { Container,TableContainer,Checkbox,Button,Modal,Paper,Select,MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import FormLabel from '@mui/material/FormLabel';
import { format } from 'date-fns';

const Orders = () => {
    const [orders, setOrders] = useState<any>(null);
    const [openModal, setModalOpen] = useState(false);
    const [deleteList, setDeleteList] = useState<any>([]);
    const [orderId, setOrderId] = useState(null);
    const [orderCustomer, setOrderCustomer] = useState('');
    const [orderCreatedBy, setOrderCreatedBy] = useState('');
    const [orderType, setOrderType] = useState('');
    const [searchString, setSearchString] = useState('');
    const [orderTypes, setOrderTypes] = useState([
        {
            value: 0,
            name: 'Standard'
        },
        {
            value: 1,
            name: 'SaleOrder'
        },{
            value: 2,
            name: 'PurchaseOrder'
        },{
            value: 3,
            name: 'TransferOrder'
        },{
            value: 4,
            name: 'ReturnOrder'
        },
    ])

    const baseUrl = "https://redcodechallenge20221005201616.azurewebsites.net"

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/Orders`);
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

    const deleteOrders = async () => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deleteList)
            };

            const response = await fetch(`${baseUrl}/api/Orders/Delete`, requestOptions);     
            setOrders(null);   
            setDeleteList(null);    
        }
        catch (error)
        {
            console.log(error);
        }

    }

    const checkOrder = (orderId) => {
        setDeleteList([...deleteList, orderId]);
    }

    const addOrder = async () => {

        try {
            // UPDATE
            if(orderId)
            {
                const body = {
                    id: orderId,
                    orderType,
                    customerName: orderCustomer,
                    createdByUserName: orderCreatedBy
                };
    
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                };
    
                const response = await fetch(`${baseUrl}/api/Orders`, requestOptions);
                const data = await response.json();
    
                var newOrders = [...orders.filter(e => e.id !== orderId)];
                setOrders([newOrders, data]);
            }
            else
            {
                // CREATE
                const body = {
                    orderType,
                    customerName: orderCustomer,
                    createdByUserName: orderCreatedBy
                };
    
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                };
    
                const response = await fetch(`${baseUrl}/api/Orders`, requestOptions);
                const data = await response.json();
    
                setOrders([...orders, data]);
            }
        }
        catch (error)
        {
            console.log(error);
        }

        resetForm();
        setModalOpen(false);
    }

    const openModalForm = (order) => {
        if(!order)
        {
            resetForm();
        }
        else
        {
            setOrderId(order.id);
            setOrderCreatedBy(order.createdByUserName);
            setOrderCustomer(order.customerName);
            setOrderType(order.orderType);
        }

        setModalOpen(true);
    }

    const formatDate = (date) => {
        var formatDate = new Date(date);
        return format(formatDate, 'EEEE, d LLLL Y');
    }

    const formatType = (typeId) => {
        var type = orderTypes.filter(e => e.value == typeId);
        return type[0].name;
    }

    const resetForm = () => {
        setOrderCustomer('');
        setOrderCreatedBy('');
        setOrderType('');
    }

    const handleTypeChange = (event) => {
        setOrderType(event.target.value);
    }

    const renderOrderType = () => {
        return orderTypes.map(type => (
            <MenuItem key={type.value} value={type.value}>{type.name}</MenuItem>
        ));
    }

    const renderTable = () => {
        if(orders)
        {
            if(searchString)
            {
                var filteredOrders = orders.filter(e => e.id.includes(searchString));

                return filteredOrders.map(order => (
                    <TableRow key={ order.id }>
                        <TableCell><Checkbox onClick={() => checkOrder(order.id)}/></TableCell>
                        <TableCell>{ order.id }</TableCell>
                        <TableCell>{ formatDate(order.createdDate) }</TableCell>
                        <TableCell>{ order.createdByUserName }</TableCell>
                        <TableCell>{ formatType(order.orderType) }</TableCell>
                        <TableCell>{ order.customerName }</TableCell>
                        <TableCell><Button><EditIcon onClick={() => openModalForm(order)}/></Button></TableCell>
                    </TableRow>
                ));
            }
            else
            {
                return orders.map(order => (
                    <TableRow key={ order.id }>
                        <TableCell><Checkbox onClick={() => checkOrder(order.id)}/></TableCell>
                        <TableCell>{ order.id }</TableCell>
                        <TableCell>{ formatDate(order.createdDate) }</TableCell>
                        <TableCell>{ order.createdByUserName }</TableCell>
                        <TableCell>{ formatType(order.orderType) }</TableCell>
                        <TableCell>{ order.customerName }</TableCell>
                        <TableCell><Button><EditIcon onClick={() => openModalForm(order)}/></Button></TableCell>
                    </TableRow>
                ));

            }
        }
    }

    return(
        <>
            <Grid container spacing={0} style={{marginTop:'20px'}}>

                <Grid item xs={2}>
                    <Input
                        onChange={ e => setSearchString(e.target.value) }
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" onClick={() => openModalForm(null)}><AddIcon/>CREATE ORDER</Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" onClick={() => deleteOrders()}><DeleteIcon/>DELETE SELECTED</Button>
                </Grid>

                <Grid item xs={12}>
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
                </Grid>
            </Grid>


            <Modal open={openModal} style={{marginTop:'50px'}}>
                <Container component={Paper} style={{padding:'20px'}}>

                    <form onSubmit={ addOrder }>
                        <FormControl style={{paddingRight:'15px'}}>
                            <FormLabel>Order Customer</FormLabel>
                            <Input value={ orderCustomer } onChange={ e => setOrderCustomer(e.target.value) } />
                        </FormControl>
                        <FormControl style={{paddingRight:'15px'}}>
                            <FormLabel>Order Created By</FormLabel>
                            <Input value={ orderCreatedBy } onChange={ e => setOrderCreatedBy(e.target.value) } />
                        </FormControl>
                        <FormControl style={{paddingRight:'15px'}}>
                            <FormLabel>Order Type</FormLabel>
                            <Select value={orderType} onChange={e => handleTypeChange(e)}>
                                { renderOrderType() }
                            </Select>
                        </FormControl>
                        <br />
                        <Button variant="contained" color="primary" type="submit" style={{marginTop:'20px', marginRight:'20px'}}>
                            { orderId ? 'Update Order' : 'Add Order'}
                        </Button>
                        <Button variant="contained" color="primary" type="submit" onClick={() => setModalOpen(false)} style={{marginTop:'20px'}}>
                            Cancel
                        </Button>
                    </form>

                </Container>
            </Modal>
        </>
    )
}

export default Orders;