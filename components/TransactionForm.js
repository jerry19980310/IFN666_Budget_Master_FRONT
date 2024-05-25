import React, { useState } from 'react';
import { Text, Platform } from 'react-native';
import { Box, Input, InputLeftAddon, InputRightAddon, InputGroup, VStack, Heading, Button, Icon, CheckIcon, Select, useToast } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';
import MyAlert from "./MyAlert";
import { GlobalStyles } from '../styles/global';
import { useTranslation } from 'react-i18next';

export default function TransactionForm({ initialData, onSubmit, categories, isNew }) {
    const [category, setCategory] = useState(initialData.category || '');
    const [money, setMoney] = useState(initialData.money || '');
    const [note, setNote] = useState(initialData.note || '');
    const [date, setDate] = useState(new Date(initialData.date || Date.now()));
    const [showPicker, setShowPicker] = useState(false);
    const toast = useToast();
    const globalStyles = GlobalStyles();
    const { t } = useTranslation();

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSubmit = () => {
        if (!money || !category) {
            toast.show({
                render: () => (
                    <MyAlert title="Warning" description="Please enter the amount and category" variant="subtle" status="warning" />
                ),
                duration: 3000,
                placement: "top"
            });
            return;
        }

        onSubmit({ money, date, note, category });

        setCategory('');
        setMoney('');
        setNote('');
        setDate(new Date());
    };

    return (
        <VStack space={4} w="90%" maxW="400px">
            <Box mt={3} pt={2}>
                <Heading size="md" mb={1} pt={3} style={globalStyles.heading}>{t('amount')}</Heading>
                <InputGroup>
                    <InputLeftAddon children={"$"} />
                    <Input
                        w="80%"
                        placeholder={t('enter_amount')}
                        onChangeText={v => setMoney(v)}
                        value={money}
                        keyboardType="numeric"
                        style={globalStyles.text}
                    />
                    <InputRightAddon children={"AUD"} />
                </InputGroup>
            </Box>

            <Box >
                <Heading size="md" mb={1} pt={1} style={globalStyles.heading}>{t('category')}</Heading>
                <Select
                    selectedValue={category}
                    minWidth="200"
                    accessibilityLabel="Choose Category"
                    placeholder={t('choose_category')}
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={itemValue => setCategory(itemValue)}
                    style={globalStyles.text}
                >
                    {categories.map((item) => (
                        <Select.Item key={item.ID} label={item.name} value={item.name} />
                    ))}
                </Select>
            </Box>

            <Box>
                <Heading size="md" mb={1} pt={1} style={globalStyles.heading}>{t('date')}</Heading>
                <Button
                    variant="outline"
                    onPress={() => setShowPicker(true)}
                >
                    {dayjs(date).format("YYYY/MM/DD")}
                </Button>
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
            </Box>

            <Box>
                <Heading size="md" mb={1} pt={1} style={globalStyles.heading}>{t('note')}</Heading>
                <Input
                    variant="outline"
                    placeholder={t('enter_note')}
                    onChangeText={v => setNote(v)}
                    value={note}
                    style={globalStyles.text}
                />
            </Box>

            {isNew ? (
                <Button
                    bg="#b8cde6"
                    leftIcon={<Icon as={AntDesign} name="save" size="lg" />}
                    onPress={handleSubmit}
                    colorScheme="teal"
                    mt={4}
                >
                    <Text style={globalStyles.text}>{t('save')}</Text>
                </Button>
            ) : (
                <Button
                    bg="#b8cde6"
                    leftIcon={<Icon as={AntDesign} name="clouduploado" size="lg" />}
                    onPress={handleSubmit}
                    colorScheme="teal"
                    mt={4}
                >
                    <Text style={globalStyles.text}>{t('update')}</Text>
                </Button>
            )}
        </VStack>
    );
}

