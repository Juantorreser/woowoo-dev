import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apis = [
    {type: 'get', endpoint: '/locations'}, //gets all locations
    {type: 'get', endpoint: '/users/healers'}, //gets all healers
    {type: 'post', endpoint: '/users'}, //creates a user
];

const api = (api, args) => {

};