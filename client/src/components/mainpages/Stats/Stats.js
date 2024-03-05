import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";
import axios from "axios";
import { Grid } from '@mui/material';

function Stats() {
    const [users, setUsers] = useState([])
    const [topics, setTopics] = useState([])
    const [articles, setArticles] = useState([])



    useEffect(() => {
        axios.get("/stats/professionals").then((res) => {
            setUsers(res.data.professionals)
        })

        axios.get("/stats/topics").then((res) => {
            setTopics(res.data)
        })

        axios.get("/stats/articles").then((res) => {
            setArticles(res.data)
        })
    }, [])

    const members = users.filter((user) => user.role == 0);
    const admins = users.filter((user) => user.role == 1);
    const professionals = users.filter((user) => user.role == 2);





    return (
        <>
            <Grid container xs={12}>
                <Grid item xs={12} sm={6} md={6}>
                    <Chart
                        width={'800px'}
                        height={'700px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Products', 'Length'],
                            ["topics", topics?.length],
                            ['articles', articles?.length],


                        ]}
                        options={{
                            title: 'Topics / Articles',
                            // Just add this option
                            is3D: true,
                        }}
                        rootProps={{ 'data-testid': '2' }}
                    />
                </Grid>
               
                <Grid item xs={12} sm={6} md={6}>
                    <Chart
                        width={'800px'}
                        height={'700px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Users', 'Length'],
                            ['professionnels', professionals?.length],
                            ['admins', admins?.length],
                            ['members', members?.length],


                        ]}
                        options={{
                            title: 'Users',
                            // Just add this option
                            is3D: true,
                        }}
                        rootProps={{ 'data-testid': '2' }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default Stats;