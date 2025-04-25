import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable } from 'react-native';
import TaskList from '../../src/components/TaskList.js';


function VoluntariosAdm() {
  const [tasks, setTasks] = useState([]);

  return (
    <View style={styles.container}>

        <TaskList tasks={tasks} />
      
    </View>
    
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
      },
      botao: {
        width: 200,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 50, 
        backgroundColor: '#8A2BE2',
        borderRadius: 5,
        elevation: 3,
        marginTop: 50,
      },
      textoBotao: {
        color: 'white',
        fontSize: 16,
      },
});

export default VoluntariosAdm;