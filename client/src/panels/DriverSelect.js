import Select from "react-select";
import {useTheme} from "@mui/material";
import {useMemo} from "react";

export default function DriverSelect({className = "", drivers, value, disabled, onChange}) {
    const theme = useTheme();
    const options = useMemo(() => drivers.map(driver => {
        return {
            value: driver.driverNumber,
            label: (<div>
                    {driver.driverNumber} - {driver.fullName} {(driver.countryCode ? (" (" + (driver.countryCode) + ")") : "")} -
                    <span
                        style={driver.teamColor ? {color: "#" + driver.teamColor} : undefined}> {driver.teamName}</span>
                </div>
            ),
        };
    }));
    const selectedOption = useMemo(() => options ? options.find(option => option.value === value) : null, [options, value]);

    function handleChange(option) {
        onChange(option.value);
    }

    return (
        <Select
            value={selectedOption}
            className={className}
            options={options}
            isDisabled={disabled}
            styles={{
                control: (provided) => ({
                    ...provided,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                }),
                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? theme.palette.action.hover : theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    ':active': {
                        backgroundColor: theme.palette.action.selected,
                    },
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: theme.palette.text.primary,
                }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: theme.palette.background.paper,
                }),
                menuList: (provided) => ({
                    ...provided,
                    '::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.action.disabledBackground,
                    },
                    '::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '2px',
                    },
                }),
            }}
            onChange={handleChange}
        />
    )
}