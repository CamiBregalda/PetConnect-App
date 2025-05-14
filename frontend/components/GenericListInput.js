import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

export const GenericListInput = ({ items, setItems, placeholder }) => {
    const handleAddItem = () => {
        setItems([...items, '']);
    };

    const handleRemoveItem = (index) => {
        const novosItems = [...items];
        novosItems.splice(index, 1);
        setItems(novosItems.length > 0 ? novosItems : ['']);
    };

    const handleChangeItem = (text, index) => {
        const novosItems = [...items];
        novosItems[index] = text;
        setItems(novosItems);
    };

    return (
        <View>
            {items.map((item, index) => (
                <View
                    key={index}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                >
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    onChangeText={(text) => handleChangeItem(text, index)}
                    value={item}
                    placeholder={placeholder}
                />
                {index === items.length - 1 && (
                    <Pressable onPress={handleAddItem} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                    </Pressable>
                )}
                {items.length > 1 && (
                    <Pressable onPress={() => handleRemoveItem(index)} style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                    </Pressable>
                )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },
    button: {
        marginLeft: 10,
        paddingHorizontal: 6,
    },
    buttonText: {
        fontSize: 20,
        color: '#888',
    },
});
