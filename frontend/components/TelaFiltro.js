import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'; // Adicionado TouchableOpacity
import { Picker } from '@react-native-picker/picker';
import { urlIp } from '@env';

const TelaFiltro = ({ visible, onClose, onApplyFilters, currentFilters }) => {
  const [especies, setEspecies] = useState([]);
  const [portes, setPortes] = useState([]);
  // Removido racasPorEspecie, pois agora as raças são buscadas dinamicamente
  const [loadingEnums, setLoadingEnums] = useState(false); // Para espécies e portes
  const [loadingRacas, setLoadingRacas] = useState(false); // Novo estado para loading de raças

  const [selectedEspecie, setSelectedEspecie] = useState(null); // Inicializa como null
  const [availableRacas, setAvailableRacas] = useState([]);
  const [selectedRaca, setSelectedRaca] = useState(null); // Inicializa como null
  const [selectedPorte, setSelectedPorte] = useState(null); // Inicializa como null

  // Efeito para carregar espécies e portes uma vez quando o modal se torna visível
  useEffect(() => {
    const fetchInitialData = async () => {
      if (visible && especies.length === 0) { // Só busca se o modal estiver visível e os dados ainda não foram carregados
        setLoadingEnums(true);
        try {
          const [especiesRes, portesRes] = await Promise.all([
            fetch(`http://${urlIp}:3000/especies`),
            fetch(`http://${urlIp}:3000/portes`),
          ]);

          let errorOccurred = false;
          if (!especiesRes.ok) {
            console.error(`Erro ao buscar espécies: ${especiesRes.status} - ${await especiesRes.text()}`);
            errorOccurred = true;
          }
          if (!portesRes.ok) {
            console.error(`Erro ao buscar portes: ${portesRes.status} - ${await portesRes.text()}`);
            errorOccurred = true;
          }

          if (errorOccurred) {
            console.error("Erro ao buscar dados iniciais de enumeração do backend.");
            setLoadingEnums(false);
            return;
          }

          const especiesData = await especiesRes.json();
          const portesData = await portesRes.json();

          setEspecies(especiesData);
          setPortes(portesData);

          // Após carregar os dados iniciais, aplicar currentFilters
          if (currentFilters) {
            setSelectedEspecie(currentFilters.especie || null);
            setSelectedPorte(currentFilters.porte || null);
            // A raça será carregada pelo próximo useEffect se currentFilters.especie existir
          }

        } catch (error) {
          console.error("Falha ao buscar dados iniciais para filtros:", error);
        } finally {
          setLoadingEnums(false);
        }
      } else if (visible && currentFilters && !selectedEspecie && !selectedPorte) {
        // Se o modal reabrir e os filtros atuais não foram aplicados (ex: após limpar)
        setSelectedEspecie(currentFilters.especie || null);
        setSelectedPorte(currentFilters.porte || null);
      }
    };

    fetchInitialData();
  }, [visible, currentFilters]); // Adicionado currentFilters como dependência

  // Efeito para buscar raças quando selectedEspecie muda
  useEffect(() => {
    const fetchRacas = async () => {
      if (selectedEspecie) {
        setLoadingRacas(true);
        setAvailableRacas([]); // Limpa raças anteriores
        // Não resetar selectedRaca aqui ainda, faremos isso após o fetch
        try {
          const response = await fetch(`http://${urlIp}:3000/especies/${encodeURIComponent(selectedEspecie)}/racas`);
          if (!response.ok) {
            console.error(`Erro ao buscar raças para ${selectedEspecie}: ${response.status} - ${await response.text()}`);
            setLoadingRacas(false);
            return;
          }
          const racasData = await response.json();
          setAvailableRacas(racasData);

          // Se currentFilters.especie é a mesma que a selecionada E currentFilters.raca existe nas novas raças,
          // então pré-seleciona a raça do currentFilters.
          // Caso contrário, se a selectedRaca atual não estiver na nova lista, reseta selectedRaca.
          if (currentFilters && currentFilters.especie === selectedEspecie && racasData.includes(currentFilters.raca)) {
            setSelectedRaca(currentFilters.raca);
          } else if (selectedRaca && !racasData.includes(selectedRaca)) {
            setSelectedRaca(null);
          }


        } catch (error) {
          console.error(`Falha ao buscar raças para ${selectedEspecie}:`, error);
        } finally {
          setLoadingRacas(false);
        }
      } else {
        setAvailableRacas([]); // Se nenhuma espécie está selecionada, limpa as raças
        setSelectedRaca(null);  // e a raça selecionada
      }
    };

    if (visible) { // Só busca raças se o modal estiver visível
        fetchRacas();
    }
  }, [selectedEspecie, visible, currentFilters]); // Adicionado currentFilters para reavaliar a raça selecionada

  const handleApply = () => {
    onApplyFilters({
      especie: selectedEspecie,
      raca: selectedRaca,
      porte: selectedPorte,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedEspecie(null);
    setSelectedRaca(null);
    setSelectedPorte(null);
    setAvailableRacas([]); // Limpa as raças disponíveis
    // Opcional: chamar onApplyFilters com filtros nulos para limpar na tela principal imediatamente
    // onApplyFilters({ especie: null, raca: null, porte: null });
  };


  if (loadingEnums && visible) { // Mostra loading apenas se estiver carregando e visível
    return (
      <Modal visible={visible} transparent={true} onRequestClose={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#8A2BE2" />
            <Text style={styles.loadingText}>Carregando opções...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filtros Avançados</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.label}>Espécie:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedEspecie}
                onValueChange={(itemValue) => {
                  // Se o valor mudar, a raça selecionada anteriormente pode não ser mais válida
                  // O useEffect de selectedEspecie cuidará de buscar novas raças e resetar selectedRaca se necessário
                  setSelectedEspecie(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma espécie..." value={null} />
                {especies.map((especie) => (
                  <Picker.Item key={especie} label={especie} value={especie} />
                ))}
              </Picker>
            </View>

            {/* Seletor de Raça (condicional e com loading) */}
            {selectedEspecie && ( // Mostra a seção de raças se uma espécie estiver selecionada
              <>
                <Text style={styles.label}>Raça:</Text>
                <View style={styles.pickerContainer}>
                  {loadingRacas ? (
                    <View style={styles.loadingRacasContainer}>
                      <ActivityIndicator size="small" color="#8A2BE2" />
                    </View>
                  ) : (
                    <Picker
                      selectedValue={selectedRaca}
                      onValueChange={(itemValue) => setSelectedRaca(itemValue)}
                      style={styles.picker}
                      enabled={availableRacas.length > 0} // Habilita se houver raças
                    >
                      <Picker.Item label={availableRacas.length > 0 ? "Selecione uma raça..." : "Nenhuma raça disponível"} value={null} />
                      {availableRacas.map((raca) => (
                        <Picker.Item key={raca} label={raca} value={raca} />
                      ))}
                    </Picker>
                  )}
                </View>
              </>
            )}

            <Text style={styles.label}>Porte:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPorte}
                onValueChange={(itemValue) => setSelectedPorte(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um porte..." value={null} />
                {portes.map((porte) => (
                  <Picker.Item key={porte} label={porte} value={porte} />
                ))}
              </Picker>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
              <Text style={styles.buttonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
              <Text style={styles.buttonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  scrollView: {
    width: '100%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    minHeight: 50, // Garante altura mínima mesmo durante o loading de raças
    justifyContent: 'center', // Centraliza o ActivityIndicator
  },
  picker: {
    width: '100%',
    height: 50, // Altura padrão do picker
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  loadingRacasContainer: { // Container para o ActivityIndicator de raças
    height: 50, // Mesma altura do picker para consistência
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Alterado para space-around para melhor espaçamento
    marginTop: 25, // Aumentado margin top
    width: '100%',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20, // Aumentado padding horizontal
    elevation: 2,
    minWidth: 120, // Aumentado minWidth
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4CAF50', // Verde para aplicar
  },
  clearButton: {
    backgroundColor: '#f44336', // Vermelho para limpar
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16, // Aumentado tamanho da fonte
  },
  closeButton: {
    marginTop: 20, // Aumentado margin top
  },
  closeButtonText: {
    color: '#888',
    fontSize: 16,
  },
});

export default TelaFiltro;