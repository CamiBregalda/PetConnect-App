import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchInput = () => {
    const [searchText, setSearchText] = React.useState('');

    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={setSearchText}
                value={searchText}
                placeholder="Pesquisar"
                keyboardType="default"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        width: 190,
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 30,
        borderWidth: 0.2,
        borderBottomWidth: 1,
        padding: 10,
    },
});

export default SearchInput;