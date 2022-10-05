import { Routes as Switch, Route, Link } from "react-router-dom";
import Orders from './orders'

const Routes = () => (
    <Switch>
        <Route path="/" element={ <Orders /> } />
    </Switch>
)

export default Routes;