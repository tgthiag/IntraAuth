//controllers/itemController.js
import db from '../config/database.js';

// **Get All Items**
export const getItems = async (req, res) => {
    try {
        const [items] = await db.execute('SELECT * FROM wizardeasymobile');
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// **Add New Item**
export const addItem = async (req, res) => {
    const {
        Environment, AliasAccess, Enable, CnpjCli, arquivojs, NomeCli,
        Descricao, UrlRestProtheus, UrlRestProtheus2, UrlRedirectEasy,
        UrlJsCustomCliente, UrlCssCustomCliente, GeraLog, AvisaLog,
        Enableauth, UserName, Password, DateLimit, wizardeasymobilecol
    } = req.body;

    if (!NomeCli || !Descricao || !UrlRestProtheus) {
        return res.status(422).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await db.execute(
            `INSERT INTO wizardeasymobile 
            (Environment, AliasAccess, Enable, CnpjCli, arquivojs, NomeCli, Descricao, UrlRestProtheus, 
             UrlRestProtheus2, UrlRedirectEasy, UrlJsCustomCliente, UrlCssCustomCliente, GeraLog, AvisaLog, 
             Enableauth, UserName, Password, DateLimit, wizardeasymobilecol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Environment, AliasAccess, Enable, CnpjCli, arquivojs, NomeCli,
                Descricao, UrlRestProtheus, UrlRestProtheus2, UrlRedirectEasy,
                UrlJsCustomCliente, UrlCssCustomCliente, GeraLog, AvisaLog,
                Enableauth, UserName, Password, DateLimit, wizardeasymobilecol
            ]
        );

        res.json({ message: 'Item added successfully', itemId: result.insertId });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// **Update Item**
export const updateItem = async (req, res) => {
    const { alias } = req.params;
    const {
        Environment, AliasAccess, Enable, CnpjCli, arquivojs, NomeCli,
        Descricao, UrlRestProtheus, UrlRestProtheus2, UrlRedirectEasy,
        UrlJsCustomCliente, UrlCssCustomCliente, GeraLog, AvisaLog,
        Enableauth, UserName, Password, DateLimit, wizardeasymobilecol
    } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE wizardeasymobile SET 
            Environment = ?, AliasAccess = ?, Enable = ?, CnpjCli = ?, arquivojs = ?, 
            NomeCli = ?, Descricao = ?, UrlRestProtheus = ?, UrlRestProtheus2 = ?, 
            UrlRedirectEasy = ?, UrlJsCustomCliente = ?, UrlCssCustomCliente = ?, 
            GeraLog = ?, AvisaLog = ?, Enableauth = ?, UserName = ?, Password = ?, 
            DateLimit = ?, wizardeasymobilecol = ?
            WHERE AliasAccess = ?`,
            [
                Environment, AliasAccess, Enable, CnpjCli, arquivojs, NomeCli,
                Descricao, UrlRestProtheus, UrlRestProtheus2, UrlRedirectEasy,
                UrlJsCustomCliente, UrlCssCustomCliente, GeraLog, AvisaLog,
                Enableauth, UserName, Password, DateLimit, wizardeasymobilecol, alias
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// **Delete Item**
export const deleteItem = async (req, res) => {
    const { alias } = req.params;

    try {
        const [result] = await db.execute('DELETE FROM wizardeasymobile WHERE AliasAccess = ?', [alias]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
