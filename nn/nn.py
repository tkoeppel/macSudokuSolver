import numpy as np
import torch
import torchvision
import matplotlib.pyplot as plt
from time import time
from torchvision import datasets, transforms
from torch import nn, optim


class VectorDataset(Dataset):
    def __init__(self, data_: dict):
        self.keys = list(data_.keys())
        self.values = list(data_.values())

    def __len__(self):
        return len(self.keys)

    def __getitem__(self, idx):
        return self.keys[idx], self.values[idx]

    def get_input_output_sizes(self) -> (int, int):
        return self.keys[0].shape[0], self.values[0].shape[0]


class Network(nn.Module):
    def __init__(self, num_inputs: int, num_outputs: int):
        super().__init__()

        self.seq = nn.Sequential(
            nn.Linear(num_inputs, int(num_inputs/2), bias=True),
            nn.ReLU(),
            nn.Linear(int(num_inputs / 2), int(num_inputs / 2), bias=True),
            nn.ReLU(),
            nn.Linear(int(num_inputs / 2), int(num_inputs / 2), bias=True),
            nn.ReLU(),
            nn.Linear(int(num_inputs / 2), int(num_inputs / 2), bias=True),
            nn.Linear(int(num_inputs / 2), num_outputs, bias=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # this executes all modules in self.seq in order
        # note that we do not need to implement a backwards pass ourselves!
        return self.seq(x)

    def iterate_loader(loader: DataLoader, cuda=False) -> (torch.Tensor, torch.Tensor):
        for k_, v_ in loader:
            if cuda:
                k_ = k_.cuda()
                v_ = v_.cuda()
            yield k_, v_

    def train(train_loader, test_loader, net: nn.Module, optimizer, criterion: nn.Module, epochs: int,
              use_cuda: bool) -> (
            [], []):
        """
        train a network
        - for 'epoch' epochs
        - in each epoch, iterate both data loaders
            - as you train, note the training losses
            - after you trained for this epoch, note the test losses
            - average the batch losses for each epoch

        :param train_loader: loader for training data
        :param test_loader: loader for test data
        :param net: network to be trained
        :param optimizer: how gradients are handled for update steps, we use stochastic gradient descent (SGD)
        :param criterion: loss function, we use mean squared error (MSE)
        :param epochs: train for this many epochs
        :param use_cuda: compute on the GPU (otherwise CPU, which is slower)
        :return: epoch-wise losses, for training and test data (of either floats or scalar tensors)
        """
        training_losses = []
        test_losses = []

        for epoch in range(epochs):
            # Training
            epoch_training_losses = []
            for input_, target_ in iterate_loader(train_loader, cuda=use_cuda):
                out = net(input_)
                loss = criterion(out, target_)
                epoch_training_losses.append(loss.item())

                # Backpropagation
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            avg_training_loss = sum(epoch_training_losses) / len(epoch_training_losses)
            training_losses.append(avg_training_loss)

            # Testing
            epoch_test_losses = []
            for input_, target_ in iterate_loader(test_loader, cuda=use_cuda):
                out = net(input_)
                loss = criterion(out, target_)
                epoch_test_losses.append(loss.item())
            avg_test_loss = sum(epoch_test_losses) / len(epoch_test_losses)
            test_losses.append(avg_test_loss)

        # return losses over the training
        assert len(training_losses) == len(test_losses) == epochs, "Need a loss for each epoch! Implement the function!"
        return training_losses, test_losses

    if __name__ == '__main__':
        parser = argparse.ArgumentParser("perceptron")
        parser.add_argument('--data_file', default="%s/data.pt" % os.getcwd(),
                            type=str)  # if the data is in the same dir as the script
        parser.add_argument('--batch_size', default=256, type=int)
        parser.add_argument('--epochs', default=100, type=int)
        parser.add_argument('--sgd_lr', default=0.01, type=float)
        parser.add_argument('--sgd_momentum', default=0.9, type=float)
        parser.add_argument('--sgd_decay', default=1e-5, type=float)
        parser.add_argument('--plot', default="true", type=str, help="plot results")
        args = parser.parse_args()
        args.plot = args.plot.lower().startswith("t")
        use_cuda_ = torch.cuda.device_count() >= 1
        torch.manual_seed(0)

        # load data, train/test split, use 2000 random samples as test set
        data = torch.load(args.data_file)
        data_set = VectorDataset(data)
        data_train, data_test = random_split(data_set, [len(data_set) - 2000, 2000])
        input_size, output_size = data_set.get_input_output_sizes()
        print(input_size, output_size)

        # create loaders
        train_loader_ = DataLoader(data_train, batch_size=args.batch_size, shuffle=True, num_workers=4)
        test_loader_ = DataLoader(data_test, batch_size=args.batch_size, shuffle=False, num_workers=4)

        # create network, optimizer, loss function
        net_ = Network(input_size, output_size)
        if use_cuda_:
            net_ = net_.cuda()
        optimizer_ = SGD(net_.parameters(), lr=args.sgd_lr, momentum=args.sgd_momentum, weight_decay=args.sgd_decay)
        criterion_ = nn.MSELoss()

        # train and test
        training_losses_, test_losses_ = train(train_loader_, test_loader_, net_, optimizer_, criterion_, args.epochs,
                                               use_cuda_)