import { Grid, TextField, styled } from '@mui/material';

const InputMUI = styled(TextField)`
    outline: 1px;
    border: 0;
    width: 400px;
    height: 54px;
`;

const ContenedorInputs = styled(Grid)`
    margin: 0 auto;
    padding: 6px 0;
    display: inline-block;
    text-align: center;
`;

const StandardInput = styled(TextField)`
    outline: 0px;
    border: 0;
    width: 100%;
    margin-top: 15px;

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }
`;

export { InputMUI, ContenedorInputs, StandardInput };
