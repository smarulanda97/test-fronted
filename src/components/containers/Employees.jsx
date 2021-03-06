import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { getEmployees, filterEmployees, addEmployees, setEmployee } from "../../store/actions/employeesActions";
import EmployeesList from "../employees/EmployeesList";
import EmployeesItem from "../employees/EmployeesItem";
import Container from "../layout/Container";
import EmployeesSearchBar from "../employees/EmployeesSearchBar";
import {invalidSearch} from "../../utils/alerts";
import EmployeesCreateRedirect from "../employees/EmployeesCreateRedirect";
import {getEmployeesLocalStorage} from "../../utils/localStorage";

const initialSearch = {
    searchBy: '',
    value: ''
};

const Employees = (props) => {
    const [search, setSearch] = useState(initialSearch);

    useEffect(() => {
        getEmployeesApi()
            .then(() => props.addEmployees(getEmployeesLocalStorage()));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        (!isValidSearch()) ? invalidSearch() : props.filterEmployees(search);
    };

    const handleChange = (e) => {
        setSearch({...search, [e.target.name]: e.target.value.trim()})
    };

    const handleClick = () => {
        setSearch(initialSearch);
        getEmployeesApi()
            .then(() => props.addEmployees(getEmployeesLocalStorage()));
    };

    const getEmployeesApi = () => {
        return new Promise((resolve, reject) => {
            try {
                resolve(props.getEmployees());
            } catch (e) {
                reject(e);
            }
        })
    };

    const handleEdit = (employeeId) => {
        const employee = props.employees.list.find((employee) => employee.id == employeeId);
        props.setEmployee(employee);
        props.history.push(`/employees/${employeeId}/edit`)
    };

    const isValidSearch = () => {
        return !(search.searchBy.trim() === "" || search.value.trim() === "")
    };

    return (
        <Container title={`Empleados`}>
            <EmployeesCreateRedirect/>

            <div className="row">
                <div className="col-12">
                    <EmployeesSearchBar
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleClick={handleClick}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-12 text-center Employees-table">
                    <EmployeesList>
                        {(props.employees.list.length > 0)
                            ?
                            props.employees.list.map(employee =>
                                <EmployeesItem
                                    {...employee}
                                    key={employee.id}
                                    handleEdit={handleEdit}
                                />)
                            :
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <p>No se encontraron resultados ...</p>
                                    <a className="btn btn-primary text-white" onClick={() => props.getEmployees()}>Refrescar</a>
                                </td>
                            </tr>
                        }
                    </EmployeesList>
                </div>
            </div>
        </Container>
    )
};

const mapStateToProps = ({ employeesReducer }) => ({
    employees: employeesReducer
});

const mapDispatchToAction = {
    setEmployee,
    getEmployees,
    addEmployees,
    filterEmployees,
};

export default connect(mapStateToProps, mapDispatchToAction)(Employees);
